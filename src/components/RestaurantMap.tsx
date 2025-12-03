'use client'

import { useEffect, useRef } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'

// Hide MapTiler attribution elements
const mapStyles = `
  .maplibregl-ctrl-logo,
  .maplibregl-ctrl-attrib,
  .maplibregl-compact,
  .mapboxgl-ctrl-logo,
  .mapboxgl-ctrl-attrib,
  a[href*="maptiler"],
  a[aria-label*="MapTiler"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    background: none !important;
  }
`

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
    className?: string
}

export default function RestaurantMap({ lat, lng, locations, className = "h-64 w-full" }: RestaurantMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<maptilersdk.Map | null>(null)
    const markers = useRef<maptilersdk.Marker[]>([])

    useEffect(() => {
        if (!mapContainer.current) return

        const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY
        if (!apiKey) {
            console.warn('MapTiler API key not found')
            return
        }

        // Determine markers data
        let markersData: Location[] = []
        let center: [number, number] = [-0.1278, 51.5074] // Default to London [lng, lat]

        if (locations && locations.length > 0) {
            markersData = locations.filter(l => l.lat && l.lng) as Location[]
            if (markersData.length > 0) {
                center = [markersData[0].lng, markersData[0].lat]
            }
        } else if (lat && lng) {
            markersData = [{ lat, lng, name: 'Restaurant' }]
            center = [lng, lat]
        }

        if (markersData.length === 0) return

        // Initialize map
        maptilersdk.config.apiKey = apiKey
        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/019ae50c-1d54-76de-883f-791cbb44fd8b/style.json?key=${apiKey}`,
            center: center,
            zoom: 13,
            navigationControl: false,
            geolocateControl: false,
        })

        // Hide MapTiler logo
        map.current.on('load', () => {
            const logoElement = mapContainer.current?.querySelector('.maplibregl-ctrl-logo')
            if (logoElement) {
                (logoElement as HTMLElement).style.display = 'none'
            }
        })

        // Add markers
        markersData.forEach((location) => {
            const marker = new maptilersdk.Marker({ color: '#4F46E5' })
                .setLngLat([location.lng, location.lat])
                .addTo(map.current!)

            if (location.name) {
                marker.setPopup(
                    new maptilersdk.Popup().setHTML(`<strong>${location.name}</strong>`)
                )
            }

            markers.current.push(marker)
        })

        // Fit bounds if multiple markers
        if (markersData.length > 1) {
            const bounds = new maptilersdk.LngLatBounds()
            markersData.forEach(location => {
                bounds.extend([location.lng, location.lat])
            })
            map.current.fitBounds(bounds, {
                padding: 50,
                maxZoom: 15
            })
        }

        // Cleanup on unmount
        return () => {
            markers.current.forEach(marker => marker.remove())
            markers.current = []
            map.current?.remove()
            map.current = null
        }
    }, [lat, lng, locations])

    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY
    if (!apiKey) {
        return (
            <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                MapTiler API key not configured
            </div>
        )
    }

    // Determine if we have location data
    let hasLocationData = false
    if (locations && locations.length > 0) {
        hasLocationData = locations.some(l => l.lat && l.lng)
    } else if (lat && lng) {
        hasLocationData = true
    }

    if (!hasLocationData) {
        return (
            <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                No location data available
            </div>
        )
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
            <div className={`${className} rounded-xl overflow-hidden border border-gray-100 shadow-sm relative`}>
                <div ref={mapContainer} className="w-full h-full" />
            </div>
        </>
    )
}
