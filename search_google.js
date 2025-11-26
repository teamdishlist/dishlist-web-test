// const fetch = require('node-fetch') // Built-in in Node 18+
require('dotenv').config({ path: '.env.local' })

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

async function searchBleecker() {
    const query = 'Bleecker burger London'
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`

    console.log(`Searching for: ${query}`)

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK') {
        console.log(`Found ${data.results.length} results:`)
        data.results.forEach(place => {
            console.log(`- ${place.name} (${place.formatted_address})`)
        })
    } else {
        console.log('Search failed:', data.status)
    }
}

searchBleecker()
