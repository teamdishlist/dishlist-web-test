/**
 * Fetch restaurant data from Google Places API
 * Converts Google's 1-5 star rating to our 0-10 scale
 */

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

export interface GooglePlaceResult {
    place_id: string
    name: string
    rating?: number // 1-5 scale
    user_ratings_total?: number
    formatted_address?: string
    geometry?: {
        location: {
            lat: number
            lng: number
        }
    }
}

/**
 * Convert Google's 1-5 rating to our 0-10 scale
 */
export function convertGoogleRating(googleRating: number): number {
    return (googleRating / 5) * 10
}

/**
 * Search for a place by name and location
 */
export async function searchPlace(
    query: string,
    location: { lat: number; lng: number }
): Promise<GooglePlaceResult | null> {
    if (!GOOGLE_API_KEY) {
        console.warn('Google Places API key not configured')
        return null
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
            `query=${encodeURIComponent(query)}` +
            `&location=${location.lat},${location.lng}` +
            `&radius=5000` +
            `&key=${GOOGLE_API_KEY}`
        )

        const data = await response.json()

        if (data.status === 'OK' && data.results.length > 0) {
            return data.results[0]
        }

        return null
    } catch (error) {
        console.error('Error fetching from Google Places:', error)
        return null
    }
}

/**
 * Get place details by place_id
 */
export async function getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
    if (!GOOGLE_API_KEY) {
        console.warn('Google Places API key not configured')
        return null
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?` +
            `place_id=${placeId}` +
            `&fields=place_id,name,rating,user_ratings_total,formatted_address,geometry` +
            `&key=${GOOGLE_API_KEY}`
        )

        const data = await response.json()

        if (data.status === 'OK') {
            return data.result
        }

        return null
    } catch (error) {
        console.error('Error fetching place details:', error)
        return null
    }
}
