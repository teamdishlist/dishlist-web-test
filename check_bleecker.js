const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkBleecker() {
    // Find Bleecker restaurant
    const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('id, name')
        .ilike('name', '%Bleecker%')

    if (error) {
        console.error('Error finding restaurant:', error)
        return
    }

    console.log('Found restaurants:', restaurants)

    for (const r of restaurants) {
        const { data: locations, error: locError } = await supabase
            .from('restaurant_locations')
            .select('*')
            .eq('restaurant_id', r.id)

        if (locError) {
            console.error('Error finding locations:', locError)
        } else {
            console.log(`Locations for ${r.name} (${r.id}):`, locations)
        }
    }
}

checkBleecker()
