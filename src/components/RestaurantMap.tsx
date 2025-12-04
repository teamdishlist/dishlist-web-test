'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
    category?: string
    rating?: number
}

interface RestaurantMapProps {
    lat?: number | null
    lng?: number | null
    locations?: Location[]
    className?: string
}

// Map category slugs to emoji icons
const getCategoryEmoji = (category?: string): string => {
    const emojiMap: Record<string, string> = {
        'burgers': '🍔',
        'pizza': '🍕',
        'fried-chicken': '🍗',
        'kebabs': '🥙',
        'curry': '🍛',
        'fish-and-chips': '🐟',
        'guinness': '🍺'
    }
    return emojiMap[category || ''] || '🍽️'
}

export default function RestaurantMap({ lat, lng, locations, className = "h-64 w-full" }: RestaurantMapProps) {
    const router = useRouter()
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<maptilersdk.Map | null>(null)
    const markers = useRef<maptilersdk.Marker[]>([])
    const isDragging = useRef(false)

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
        // Initialize map with geolocation enabled
        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/019ae50c-1d54-76de-883f-791cbb44fd8b/style.json?key=${apiKey}`,
            center: center,
            zoom: 13,
            navigationControl: false,
            // Enable built‑in geolocate control
            geolocateControl: true,
        })

        // Track clicking to navigate to map page
        let clickStartTime = 0
        let clickStartPos: { x: number; y: number } | null = null
        
        map.current.on('click', (e) => {
            // Only navigate if it's a quick click (not a drag)
            const clickDuration = Date.now() - clickStartTime
            if (clickDuration < 300 && clickStartPos) {
                const distance = Math.sqrt(
                    Math.pow(e.point.x - clickStartPos.x, 2) + 
                    Math.pow(e.point.y - clickStartPos.y, 2)
                )
                // If moved less than 5 pixels, treat as click
                if (distance < 5) {
                    router.push('/map')
                }
            }
        })
        
        map.current.on('mousedown', (e) => {
            clickStartTime = Date.now()
            clickStartPos = { x: e.point.x, y: e.point.y }
        })
        
        map.current.on('touchstart', (e) => {
            clickStartTime = Date.now()
            if (e.point) {
                clickStartPos = { x: e.point.x, y: e.point.y }
            }
        })
        // Add a custom GeolocateControl for better UX (shows user location & tracks)
        const geolocate = new maptilersdk.GeolocateControl({
            // position removed; defaults to top-right
            showUserLocation: true,
            trackUserLocation: true,
            fitBoundsOptions: { maxZoom: 15 },
        })
        map.current.addControl(geolocate)

        // Hide MapTiler logo
        map.current.on('load', () => {
            const logoElement = mapContainer.current?.querySelector('.maplibregl-ctrl-logo')
            if (logoElement) {
                (logoElement as HTMLElement).style.display = 'none'
            }
        })

        // Add custom markers
        markersData.forEach((location) => {
            // Create custom marker element
            const markerEl = document.createElement('div')
            markerEl.className = 'custom-map-marker'

            const emoji = getCategoryEmoji(location.category)
            const rating = location.rating ? location.rating.toFixed(1) : '—'

            markerEl.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: white;
                    padding: 6px 10px;
                    border-radius: 20px;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
                    font-family: 'Sofia Sans', sans-serif;
                    font-weight: 700;
                    font-size: 16px;
                    white-space: nowrap;
                ">
                    <span style="font-size: 20px;">${emoji}</span>
                    <span style="color: #180400;">${rating}</span>
                </div>
            `

            const marker = new maptilersdk.Marker({ element: markerEl, anchor: 'bottom' })
                .setLngLat([location.lng, location.lat])
                .addTo(map.current!)

            if (location.name) {
                marker.setPopup(
                    new maptilersdk.Popup({ offset: 25 }).setHTML(`<strong>${location.name}</strong>`)
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
