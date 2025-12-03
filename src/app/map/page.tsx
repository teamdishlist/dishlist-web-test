'use client'

import { useState, useEffect } from 'react'
import RestaurantMap from '@/components/RestaurantMap'
import { getCategories, getCategoryRestaurants } from '@/lib/mock-queries'
import Header from '@/components/Header'

export default function MapPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [categories, setCategories] = useState<any[]>([])
    const [allRestaurants, setAllRestaurants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

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
        rating: r.avg_rating
    }))

    return (
        <div className="max-w-md mx-auto min-h-screen relative bg-[#F6F2F1]">
            <Header />

            {/* Category Filters */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${selectedCategory === 'all'
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
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat.slug
                                    ? 'bg-[#1E1947] text-white font-bold'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Map */}
            {loading ? (
                <div className="h-[calc(100vh-220px)] w-full flex items-center justify-center">
                    <div className="text-gray-500">Loading restaurants...</div>
                </div>
            ) : (
                <div className="h-[calc(100vh-220px)] w-full relative px-4">
                    <RestaurantMap
                        locations={mapLocations}
                        className="w-full h-full rounded-xl"
                    />
                </div>
            )}
        </div>
    )
}
