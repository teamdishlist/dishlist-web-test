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
            'Tommi\'s Burger Joint', 'Lucky Chip', 'Haché', 'Meat Market'
        ]

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

        for (const restaurant of restaurants) {
            if (isChain(restaurant.name)) {
                const chainName = getChainName(restaurant.name)
                if (!chainGroups[chainName]) {
                    chainGroups[chainName] = []
                }
                chainGroups[chainName].push(restaurant)
            } else {
                independents.push(restaurant)
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
