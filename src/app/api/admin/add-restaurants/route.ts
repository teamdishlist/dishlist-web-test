import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
    try {
        const { restaurants, categorySlug } = await request.json()

        // Use service role key to bypass RLS
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // Get London city
        const { data: city } = await supabase
            .from('cities')
            .select('id')
            .eq('slug', 'london')
            .single()

        if (!city) {
            return NextResponse.json({ error: 'London city not found' }, { status: 404 })
        }

        // Get category
        const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single()

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }

        // Known burger chains to group
        const BURGER_CHAINS = [
            'Five Guys', 'Shake Shack', 'Honest Burgers', 'Byron',
            'Patty & Bun', 'GBK', 'Gourmet Burger Kitchen', 'MEATliquor',
            'Bleecker', 'Black Bear Burger', 'Burger & Lobster', 'Dirty Burger',
            'Tommi\'s Burger Joint', 'Lucky Chip', 'Haché', 'Meat Market',
            'Dirty Bones', 'Burger & Beyond', 'Black Tap'
        ]

        // Parse restaurant name to extract location suffix
        const parseRestaurantName = (fullName: string) => {
            // First, clean up trailing punctuation
            let cleaned = fullName.trim().replace(/[\s\-|–—]+$/, '')

            // Common patterns: "Restaurant - Location", "Restaurant Location", "Restaurant, Location"
            const patterns = [
                /^(.+?)\s*[-–—|]\s*(.+)$/,  // "Dirty Bones - Soho" or "Truffle Burger |"
                /^(.+?),\s*(.+)$/,          // "Dirty Bones, Soho"
                /^(.+?)\s+(Soho|Shoreditch|Covent Garden|Carnaby|Fitzrovia|Mayfair|Camden|Brixton|Clapham|Hackney|Islington|Borough|Southwark|Notting Hill|Kensington|Chelsea|Marylebone|Paddington|King's Cross|Liverpool Street|Canary Wharf|Greenwich|Richmond|Wimbledon|Hammersmith|Fulham|Battersea|Vauxhall|Waterloo|London Bridge|Tower Bridge|Spitalfields|Dalston|Peckham|Bethnal Green|Whitechapel|Victoria|Westminster|Holborn|Bloomsbury|Clerkenwell|Farringdon|Angel|Old Street|Moorgate|Bank|Monument|Barbican|St Paul's|Chancery Lane|Temple|Embankment|Charing Cross|Leicester Square|Piccadilly|Oxford Circus|Bond Street|Marble Arch|Lancaster Gate|Bayswater|Queensway|High Street Kensington|Earl's Court|South Kensington|Sloane Square|Knightsbridge|Hyde Park Corner|Green Park|St James's Park|Pimlico|Elephant & Castle|Kennington|Oval|Stockwell|Clapham North|Clapham Common|Clapham South)$/i
            ]

            for (const pattern of patterns) {
                const match = cleaned.match(pattern)
                if (match) {
                    return {
                        name: match[1].trim(),
                        location: match[2].trim()
                    }
                }
            }

            // No pattern matched, return cleaned name
            return {
                name: cleaned,
                location: null
            }
        }

        const isChain = (name: string) => {
            return BURGER_CHAINS.some(chain =>
                name.toLowerCase().includes(chain.toLowerCase())
            )
        }

        const getChainName = (name: string) => {
            const chain = BURGER_CHAINS.find(c =>
                name.toLowerCase().includes(c.toLowerCase())
            )
            return chain || name
        }

        // Group restaurants by chain
        const chainGroups: { [key: string]: any[] } = {}
        const independents: any[] = []
        const nameCount: { [key: string]: number } = {}

        // First pass: count occurrences of each name
        for (const restaurant of restaurants) {
            const parsed = parseRestaurantName(restaurant.name)
            const cleanName = parsed.name
            nameCount[cleanName] = (nameCount[cleanName] || 0) + 1
        }

        // Second pass: group by chain or duplicate names
        for (const restaurant of restaurants) {
            const parsed = parseRestaurantName(restaurant.name)
            const cleanName = parsed.name

            // Use parsed location if available, otherwise use provided neighbourhood
            const location = parsed.location || restaurant.neighbourhood

            // Treat as chain if: 1) in predefined list, OR 2) appears multiple times
            const isChainRestaurant = isChain(cleanName) || nameCount[cleanName] > 1

            if (isChainRestaurant) {
                const chainName = getChainName(cleanName)
                if (!chainGroups[chainName]) {
                    chainGroups[chainName] = []
                }
                chainGroups[chainName].push({
                    ...restaurant,
                    name: cleanName,
                    neighbourhood: location
                })
            } else {
                independents.push({
                    ...restaurant,
                    name: cleanName,
                    neighbourhood: location
                })
            }
        }

        const results = []

        // Insert chains as single entries with "Multiple Locations"
        for (const [chainName, locations] of Object.entries(chainGroups)) {
            // Check if chain already exists
            const { data: existing } = await supabase
                .from('restaurants')
                .select('id')
                .eq('name', chainName)
                .eq('city_id', city.id)
                .single()

            let restaurantId: string

            if (existing) {
                restaurantId = existing.id
                results.push({ name: chainName, success: true, note: 'Already exists, added locations' })
            } else {
                const { data: restaurant, error } = await supabase
                    .from('restaurants')
                    .insert({
                        name: chainName,
                        city_id: city.id,
                        neighbourhood: 'Multiple Locations',
                        address: `${locations.length} locations across London`,
                        lat: null,
                        lng: null,
                        google_place_id: null
                    })
                    .select()
                    .single()

                if (error) {
                    results.push({ name: chainName, success: false, error: error.message })
                    continue
                }

                restaurantId = restaurant.id

                // Link to category
                await supabase
                    .from('restaurant_categories')
                    .insert({
                        restaurant_id: restaurantId,
                        category_id: category.id
                    })

                results.push({ name: chainName, success: true, note: `${locations.length} locations` })
            }

            // Store individual locations
            for (const location of locations) {
                await supabase
                    .from('restaurant_locations')
                    .insert({
                        restaurant_id: restaurantId,
                        name: location.name,
                        address: location.address,
                        lat: location.lat,
                        lng: location.lng,
                        google_place_id: location.google_place_id
                    })
            }
        }

        // Insert independents normally
        for (const place of independents) {
            const { data: restaurant, error } = await supabase
                .from('restaurants')
                .insert({
                    name: place.name,
                    city_id: city.id,
                    neighbourhood: place.neighbourhood,
                    address: place.address,
                    lat: place.lat,
                    lng: place.lng,
                    google_place_id: place.google_place_id
                })
                .select()
                .single()

            if (error) {
                results.push({ name: place.name, success: false, error: error.message })
                continue
            }

            if (restaurant) {
                const { error: linkError } = await supabase
                    .from('restaurant_categories')
                    .insert({
                        restaurant_id: restaurant.id,
                        category_id: category.id
                    })

                if (linkError) {
                    results.push({ name: place.name, success: false, error: linkError.message })
                    continue
                }

                results.push({ name: place.name, success: true })
            }
        }

        return NextResponse.json({ results })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
