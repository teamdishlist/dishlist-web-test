import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('query') || 'burger restaurant in London'

        // First, do a text search to get place IDs
        const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
        searchUrl.searchParams.append('query', query)
        searchUrl.searchParams.append('key', GOOGLE_API_KEY!)
        searchUrl.searchParams.append('type', 'restaurant')

        const searchResponse = await fetch(searchUrl.toString())
        const searchData = await searchResponse.json()

        if (searchData.status !== 'OK') {
            return NextResponse.json(searchData)
        }

        // Get detailed info for each place (including accurate ratings)
        const detailedResults = []

        for (const place of searchData.results.slice(0, 30)) {
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

            // Rate limit: 50ms between requests
            await new Promise(resolve => setTimeout(resolve, 50))
        }

        return NextResponse.json({
            ...searchData,
            results: detailedResults
        })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
