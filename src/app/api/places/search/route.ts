import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('query') || 'burger restaurant in London'

        // Known burger chains to expand
        const BURGER_CHAINS = [
            'Five Guys', 'Shake Shack', 'Honest Burgers', 'Byron',
            'Patty & Bun', 'GBK', 'Gourmet Burger Kitchen', 'MEATliquor',
            'Bleecker', 'Black Bear Burger', 'Burger & Lobster', 'Dirty Burger',
            'Tommi\'s Burger Joint', 'Lucky Chip', 'Haché', 'Meat Market',
            'Dirty Bones', 'Burger & Beyond', 'Black Tap'
        ]

        // First, do a text search to get place IDs (fetch up to 3 pages = 60 results)
        let allResults: any[] = []
        let nextPageToken = ''

        for (let i = 0; i < 3; i++) {
            const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
            searchUrl.searchParams.append('query', query)
            searchUrl.searchParams.append('key', GOOGLE_API_KEY!)
            searchUrl.searchParams.append('type', 'restaurant')

            if (nextPageToken) {
                searchUrl.searchParams.append('pagetoken', nextPageToken)
                // Wait 2 seconds for token to become valid
                await new Promise(resolve => setTimeout(resolve, 2000))
            }

            const searchResponse = await fetch(searchUrl.toString())
            const searchData = await searchResponse.json()

            if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
                break
            }

            if (searchData.results) {
                allResults = [...allResults, ...searchData.results]
            }

            nextPageToken = searchData.next_page_token
            if (!nextPageToken) break
        }

        const processedChains = new Set<string>()

        // Identify chains in the initial results and fetch all their locations
        // We iterate through a copy to avoid issues if we modify allResults (though we append to it)
        const initialResults = [...allResults]

        for (const place of initialResults) {
            const chainName = BURGER_CHAINS.find(c => place.name.toLowerCase().includes(c.toLowerCase()))

            if (chainName && !processedChains.has(chainName)) {
                processedChains.add(chainName)

                // Fetch all locations for this chain
                const chainQuery = `${chainName} locations London`
                const chainUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
                chainUrl.searchParams.append('query', chainQuery)
                chainUrl.searchParams.append('key', GOOGLE_API_KEY!)

                const chainResponse = await fetch(chainUrl.toString())
                const chainData = await chainResponse.json()

                if (chainData.status === 'OK') {
                    allResults = [...allResults, ...chainData.results]
                }

                // Small delay to be nice to the API
                await new Promise(resolve => setTimeout(resolve, 100))
            }
        }

        // Deduplicate by place_id
        const uniqueResults = Array.from(new Map(allResults.map(item => [item.place_id, item])).values())

        // Get detailed info for each place (limit to 100 to get a good top list)
        const detailedResults = []

        for (const place of uniqueResults.slice(0, 100)) {
            // Fetch detailed place info
            const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json')
            detailsUrl.searchParams.append('place_id', place.place_id)
            detailsUrl.searchParams.append('fields', 'name,rating,user_ratings_total,formatted_address,geometry,types,vicinity')
            detailsUrl.searchParams.append('key', GOOGLE_API_KEY!)

            const detailsResponse = await fetch(detailsUrl.toString())
            const detailsData = await detailsResponse.json()

            if (detailsData.status === 'OK' && detailsData.result) {
                detailedResults.push({
                    ...place,
                    rating: detailsData.result.rating || place.rating,
                    user_ratings_total: detailsData.result.user_ratings_total || place.user_ratings_total
                })
            } else {
                detailedResults.push(place)
            }

            // Rate limit: 20ms between requests
            await new Promise(resolve => setTimeout(resolve, 20))
        }

        return NextResponse.json({
            status: 'OK',
            results: detailedResults
        })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
