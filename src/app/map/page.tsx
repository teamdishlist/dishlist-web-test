'use client'

import { useState, useEffect, useRef } from 'react'
import RestaurantMap from '@/components/RestaurantMap'
import RestaurantSheet from '@/components/RestaurantSheet'
import { getCategories, getCategoryRestaurants, getRestaurant, RestaurantWithDetails } from '@/lib/mock-queries'
import Header from '@/components/Header'

export default function MapPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [categories, setCategories] = useState<any[]>([])
    const [allRestaurants, setAllRestaurants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantWithDetails | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const headerRef = useRef<HTMLElement>(null)
    const [headerHeight, setHeaderHeight] = useState(120)

    useEffect(() => {
        async function fetchData() {
            const cats = await getCategories()
            setCategories(cats)

            // Fetch restaurants from all categories
            const allCategoryRestaurants = await Promise.all(
                cats.map(cat => getCategoryRestaurants(cat.slug, 'london-city-id'))
            )

            // Flatten and deduplicate
            const restaurantMap = new Map()
            allCategoryRestaurants.flat().forEach(restaurant => {
                if (!restaurantMap.has(restaurant.id) && restaurant.lat && restaurant.lng) {
                    restaurantMap.set(restaurant.id, restaurant)
                }
            })

            setAllRestaurants(Array.from(restaurantMap.values()))
            setLoading(false)
        }

        fetchData()
    }, [])

    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight)
            }
        }

        updateHeaderHeight()
        window.addEventListener('resize', updateHeaderHeight)
        return () => window.removeEventListener('resize', updateHeaderHeight)
    }, [])

    // Filter restaurants by category
    const filteredRestaurants = selectedCategory === 'all'
        ? allRestaurants
        : allRestaurants.filter(r =>
            r.categories?.some((cat: any) => cat.slug === selectedCategory)
        )

    const mapLocations = filteredRestaurants.map(r => ({
        lat: r.lat!,
        lng: r.lng!,
        name: r.name,
        address: r.address || undefined,
        category: r.categories?.[0]?.slug,
        rating: r.avg_rating,
        restaurantId: r.id // Add restaurant ID for marker clicks
    }))

    const handleMarkerClick = async (restaurantId: string) => {
        const restaurant = await getRestaurant(restaurantId)
        if (restaurant) {
            setSelectedRestaurant(restaurant)
            setIsSheetOpen(true)
        }
    }

    const handleMapClick = () => {
        setIsSheetOpen(false)
        setSelectedRestaurant(null)
    }

    return (
        <div className="w-full min-h-screen relative">
            <div ref={headerRef as any} className="bg-[#1E1947]">
                <Header />
            </div>

            {/* Map - Full Bleed */}
            {loading ? (
                <div 
                    className="absolute inset-0 w-full flex items-center justify-center bg-gray-100"
                    style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}
                >
                    <div className="text-gray-500">Loading restaurants...</div>
                </div>
            ) : (
                <div 
                    className="absolute inset-0 w-full"
                    style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}
                >
                    <RestaurantMap
                        locations={mapLocations}
                        className="w-full h-full"
                        onMarkerClick={handleMarkerClick}
                        onMapClick={handleMapClick}
                    />
                </div>
            )}

            {/* Category Filters - Overlay on top of map */}
            <div className="fixed left-0 right-0 z-20" style={{ top: `${headerHeight + 24}px` }}>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 max-w-md mx-auto">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition flex-shrink-0 ${selectedCategory === 'all'
                                ? 'bg-[#1E1947] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${selectedCategory === cat.slug
                                    ? 'bg-[#1E1947] text-white font-bold'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Restaurant Sheet */}
            <RestaurantSheet
                restaurant={selectedRestaurant}
                isOpen={isSheetOpen}
                onClose={handleMapClick}
            />
        </div>
    )
}
