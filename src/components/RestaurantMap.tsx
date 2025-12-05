'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'

// Hide MapTiler attribution elements and style geolocate control
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
  .maplibregl-ctrl-bottom-right {
    bottom: 88px !important;
    z-index: 60 !important;
  }
  @media (min-width: 768px) {
    .maplibregl-ctrl-bottom-right {
      bottom: 10px !important;
    }
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
    restaurantId?: string // Add restaurant ID for fetching details
}

interface RestaurantMapProps {
    lat?: number | null
    lng?: number | null
    locations?: Location[]
    className?: string
    static?: boolean // If true, map is non-interactive (static view)
    onMarkerClick?: (restaurantId: string) => void // Callback when marker is clicked
    onMapClick?: () => void // Callback when map background is clicked
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

export default function RestaurantMap({ lat, lng, locations, className = "h-64 w-full", static: isStatic = false, onMarkerClick, onMapClick }: RestaurantMapProps) {
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
        // Use MapStyle enum which automatically handles API key
        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS,
            center: center,
            zoom: 13,
            navigationControl: false,
            // Disable built‑in geolocate control - we'll add it manually with custom positioning
            geolocateControl: false,
            // Disable interactions if static
            interactive: !isStatic,
            dragPan: !isStatic,
            dragRotate: !isStatic,
            scrollZoom: !isStatic,
            boxZoom: !isStatic,
            doubleClickZoom: !isStatic,
            keyboard: !isStatic,
            touchZoomRotate: !isStatic,
            touchPitch: !isStatic,
        })
        
        // Handle style loading errors
        map.current.on('error', (e) => {
            console.warn('Map style loading error, this is non-fatal:', e)
        })

        // Add geolocate control in bottom right (only for non-static maps)
        // Add it immediately after map creation, then adjust position on load
        if (!isStatic && map.current) {
            try {
                const geolocate = new maptilersdk.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                })
                map.current.addControl(geolocate, 'bottom-right')
            } catch (error) {
                console.error('Error adding geolocate control:', error)
            }
        }
        
        // If static, disable all interactions after map loads
        if (isStatic) {
            map.current.on('load', () => {
                if (map.current) {
                    map.current.dragPan.disable()
                    map.current.scrollZoom.disable()
                    map.current.boxZoom.disable()
                    map.current.dragRotate.disable()
                    map.current.doubleClickZoom.disable()
                    map.current.keyboard.disable()
                    map.current.touchZoomRotate.disable()
                    map.current.touchPitch.disable()
                }
            })
        }

        // Track clicking to navigate to map page (only if static)
        if (isStatic) {
            map.current.on('click', () => {
                router.push('/map')
            })
        } else {
            // For interactive maps, handle map background clicks
            if (onMapClick) {
                map.current.on('click', (e) => {
                    // Check if click was on a marker (markers handle their own clicks)
                    // If not on a marker, trigger map click handler
                    const target = e.originalEvent?.target as HTMLElement
                    if (target && !target.closest('.custom-map-marker')) {
                        onMapClick()
                    }
                })
            }
        }

        // Hide MapTiler logo and position geolocate control correctly
        map.current.on('load', () => {
            const logoElement = mapContainer.current?.querySelector('.maplibregl-ctrl-logo')
            if (logoElement) {
                (logoElement as HTMLElement).style.display = 'none'
            }

            // Position geolocate control above bottom nav (only for non-static maps)
            if (!isStatic) {
                setTimeout(() => {
                    const ctrlElement = mapContainer.current?.querySelector('.maplibregl-ctrl-bottom-right')
                    if (ctrlElement) {
                        const htmlElement = ctrlElement as HTMLElement
                        htmlElement.style.bottom = '88px'
                        htmlElement.style.zIndex = '60'
                    }
                }, 100)
            }
        })

        // Add custom markers
        markersData.forEach((location) => {
            // Create custom marker element
            const markerEl = document.createElement('div')
            markerEl.className = 'custom-map-marker'
            markerEl.style.position = 'relative'

            const emoji = getCategoryEmoji(location.category)
            const rating = location.rating ? location.rating.toFixed(1) : '—'

            markerEl.innerHTML = `
                <div style="
                    position: relative;
                    width: 72px;
                    height: 41.63px;
                    background: #FFFFFF;
                    border-radius: 20px;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    font-family: 'Sofia Sans', sans-serif;
                    font-weight: 700;
                    font-size: 16px;
                ">
                    <span style="font-size: 20px;">${emoji}</span>
                    <span style="color: #180400;">${rating}</span>
                    <div style="
                        position: absolute;
                        bottom: -6px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-top: 6px solid #FFFFFF;
                        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.15));
                    "></div>
                </div>
            `

            const marker = new maptilersdk.Marker({ element: markerEl, anchor: 'bottom' })
                .setLngLat([location.lng, location.lat])
                .addTo(map.current!)

            // Add click handler to marker
            if (location.restaurantId && onMarkerClick) {
                markerEl.style.cursor = 'pointer'
                markerEl.addEventListener('click', (e) => {
                    e.stopPropagation()
                    if (location.restaurantId) {
                        onMarkerClick(location.restaurantId)
                    }
                })
            }

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
    }, [lat, lng, locations, isStatic])

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
            <div 
                className={`${className} rounded-xl overflow-hidden border border-gray-100 shadow-sm relative ${isStatic ? 'cursor-pointer' : ''}`}
            >
                <div ref={mapContainer} className="w-full h-full" />
            </div>
        </>
    )
}
