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

        const results = []

        for (const place of restaurants) {
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
