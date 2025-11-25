/**
 * Script to populate burger restaurants from Google Places API
 * Run with: node scripts/populate-burgers.js
 */

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// London coordinates
const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 }
const SEARCH_RADIUS = 10000 // 10km

// Known burger chains to group
const BURGER_CHAINS = [
    'Five Guys',
    'Shake Shack',
    'Honest Burgers',
    'Byron',
    'Patty & Bun',
    'GBK',
    'Gourmet Burger Kitchen',
    'MEATliquor',
    'Bleecker',
    'Black Bear Burger'
]

async function searchBurgerRestaurants() {
    // Using the new Places API (New) - Text Search
    const url = 'https://places.googleapis.com/v1/places:searchText'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.id,places.types'
        },
        body: JSON.stringify({
            textQuery: 'burger restaurant in London',
            locationBias: {
                circle: {
                    center: {
                        latitude: LONDON_CENTER.lat,
                        longitude: LONDON_CENTER.lng
                    },
                    radius: SEARCH_RADIUS
                }
            },
            maxResultCount: 20
        })
    })

    const data = await response.json()

    if (!response.ok) {
        console.error('API Response:', data)
        throw new Error(`Google Places API error: ${data.error?.message || response.statusText}`)
    }

    // Convert new API format to our expected format
    return (data.places || []).map(place => ({
        place_id: place.id,
        name: place.displayName?.text || 'Unknown',
        rating: place.rating,
        user_ratings_total: place.userRatingCount,
        formatted_address: place.formattedAddress,
        vicinity: place.formattedAddress,
        geometry: {
            location: {
                lat: place.location?.latitude,
                lng: place.location?.longitude
            }
        },
        types: place.types || []
    }))
}

// getPlaceDetails is no longer needed with the new API
// All details are included in the search response

function isChain(restaurantName) {
    return BURGER_CHAINS.some(chain =>
        restaurantName.toLowerCase().includes(chain.toLowerCase())
    )
}

function getChainName(restaurantName) {
    const chain = BURGER_CHAINS.find(c =>
        restaurantName.toLowerCase().includes(c.toLowerCase())
    )
    return chain || restaurantName
}

function extractNeighbourhood(address) {
    // Extract neighbourhood from formatted address
    // e.g., "123 Street, Soho, London" -> "Soho"
    const parts = address.split(',').map(p => p.trim())
    if (parts.length >= 2) {
        // Return the second-to-last part (usually the neighbourhood)
        return parts[parts.length - 2]
    }
    return 'London'
}

async function insertIntoSupabase(restaurants) {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Get London city ID
    const { data: city } = await supabase
        .from('cities')
        .select('id')
        .eq('slug', 'london')
        .single()

    if (!city) {
        throw new Error('London city not found in database')
    }

    // Get burgers category ID
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'burgers')
        .single()

    if (!category) {
        throw new Error('Burgers category not found in database')
    }

    // Group by chain
    const chainLocations = {}
    const independents = []

    for (const restaurant of restaurants) {
        if (isChain(restaurant.name)) {
            const chainName = getChainName(restaurant.name)
            if (!chainLocations[chainName]) {
                chainLocations[chainName] = []
            }
            chainLocations[chainName].push(restaurant)
        } else {
            independents.push(restaurant)
        }
    }

    console.log(`Found ${Object.keys(chainLocations).length} chains and ${independents.length} independents`)

    // Insert chains (with "Multiple Locations")
    for (const [chainName, locations] of Object.entries(chainLocations)) {
        console.log(`Inserting chain: ${chainName} (${locations.length} locations)`)

        // Calculate average rating
        const avgRating = locations.reduce((sum, loc) => sum + (loc.rating || 0), 0) / locations.length

        const { data: restaurant, error } = await supabase
            .from('restaurants')
            .insert({
                name: chainName,
                city_id: city.id,
                neighbourhood: 'Multiple Locations',
                address: `${locations.length} locations across London`,
                lat: LONDON_CENTER.lat,
                lng: LONDON_CENTER.lng,
                google_place_id: locations[0].place_id // Use first location's place_id
            })
            .select()
            .single()

        if (error) {
            console.error(`Error inserting ${chainName}:`, error)
            continue
        }

        // Link to category
        await supabase
            .from('restaurant_categories')
            .insert({
                restaurant_id: restaurant.id,
                category_id: category.id
            })

        // TODO: Store individual locations in a separate table for map display
        console.log(`✓ Inserted ${chainName}`)
    }

    // Insert independents
    for (const restaurant of independents) {
        console.log(`Inserting independent: ${restaurant.name}`)

        const { data: newRestaurant, error } = await supabase
            .from('restaurants')
            .insert({
                name: restaurant.name,
                city_id: city.id,
                neighbourhood: extractNeighbourhood(restaurant.formatted_address || restaurant.vicinity),
                address: restaurant.formatted_address || restaurant.vicinity,
                lat: restaurant.geometry?.location?.lat,
                lng: restaurant.geometry?.location?.lng,
                google_place_id: restaurant.place_id
            })
            .select()
            .single()

        if (error) {
            console.error(`Error inserting ${restaurant.name}:`, error)
            continue
        }

        // Link to category
        await supabase
            .from('restaurant_categories')
            .insert({
                restaurant_id: newRestaurant.id,
                category_id: category.id
            })

        console.log(`✓ Inserted ${restaurant.name}`)
    }
}

async function main() {
    console.log('Fetching burger restaurants from Google Places API...')

    const results = await searchBurgerRestaurants()
    console.log(`Found ${results.length} burger restaurants`)

    // Filter to only include highly-rated burger places
    const burgerPlaces = results.filter(place => {
        const isBurgerPlace = place.types?.includes('restaurant') ||
            place.types?.includes('meal_takeaway')
        const hasGoodRating = (place.rating || 0) >= 3.5
        return isBurgerPlace && hasGoodRating
    })

    console.log(`Filtered to ${burgerPlaces.length} quality burger restaurants`)

    // Insert into Supabase
    await insertIntoSupabase(burgerPlaces)

    console.log('✅ Done!')
}

main().catch(console.error)
