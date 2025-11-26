import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('query') || 'burger restaurant in London'

        const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
        url.searchParams.append('query', query)
        url.searchParams.append('key', GOOGLE_API_KEY!)
        url.searchParams.append('type', 'restaurant')

        const response = await fetch(url.toString())
        const data = await response.json()

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
