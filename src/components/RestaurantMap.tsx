'use client'

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'

interface Location {
    id?: string
    name?: string
    lat: number
    lng: number
    address?: string
}

interface RestaurantMapProps {
    lat?: number | null
    lng?: number | null
    locations?: Location[]
}

export default function RestaurantMap({ lat, lng, locations }: RestaurantMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

    if (!apiKey) return null

    // Determine center and markers
    let markers: Location[] = []
    let center = { lat: 51.5074, lng: -0.1278 } // Default to London

    if (locations && locations.length > 0) {
        markers = locations.filter(l => l.lat && l.lng) as Location[]
        if (markers.length > 0) {
            center = { lat: markers[0].lat, lng: markers[0].lng }
        }
    } else if (lat && lng) {
        markers = [{ lat, lng, name: 'Restaurant' }]
        center = { lat, lng }
    }

    if (markers.length === 0) {
        return (
            <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                No location data available
            </div>
        )
    }

    return (
        <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm relative z-0">
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={center}
                    defaultZoom={13}
                    mapId="DEMO_MAP_ID" // Required for AdvancedMarker
                    disableDefaultUI={true}
                    className="w-full h-full"
                >
                    {markers.map((marker, idx) => (
                        <AdvancedMarker
                            key={idx}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            title={marker.name}
                        >
                            <Pin background={'#4F46E5'} borderColor={'#4338ca'} glyphColor={'white'} />
                        </AdvancedMarker>
                    ))}
                </Map>
            </APIProvider>
        </div>
    )
}
