'use client'

import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'
import { useEffect } from 'react'

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

function MapContent({ markers }: { markers: Location[] }) {
    const map = useMap()

    useEffect(() => {
        if (!map || markers.length === 0) return

        if (markers.length > 1) {
            const bounds = new google.maps.LatLngBounds()
            markers.forEach(marker => {
                bounds.extend({ lat: marker.lat, lng: marker.lng })
            })
            map.fitBounds(bounds)

            // Adjust zoom if it's too close or too far after fitting
            const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
                const zoom = map.getZoom()
                if (zoom && zoom > 15) map.setZoom(15)
            })
            return () => google.maps.event.removeListener(listener)
        } else {
            map.setCenter({ lat: markers[0].lat, lng: markers[0].lng })
            map.setZoom(15)
        }
    }, [map, markers])

    return (
        <>
            {markers.map((marker, idx) => (
                <AdvancedMarker
                    key={idx}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    title={marker.name}
                >
                    <Pin background={'#4F46E5'} borderColor={'#4338ca'} glyphColor={'white'} />
                </AdvancedMarker>
            ))}
        </>
    )
}

export default function RestaurantMap({ lat, lng, locations }: RestaurantMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

    if (!apiKey) return null

    // Determine markers
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
                    mapId="DEMO_MAP_ID"
                    disableDefaultUI={true}
                    className="w-full h-full"
                >
                    <MapContent markers={markers} />
                </Map>
            </APIProvider>
        </div>
    )
}
