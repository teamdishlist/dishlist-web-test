'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DiagnosticPage() {
    const [restaurants, setRestaurants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()

            const { data: city } = await supabase
                .from('cities')
                .select('id')
                .eq('slug', 'london')
                .single()

            if (!city) return

            const { data } = await supabase
                .from('restaurants')
                .select(`
          id,
          name,
          neighbourhood,
          ratings(score, source)
        `)
                .eq('city_id', city.id)
                .order('name')

            setRestaurants(data || [])
            setLoading(false)
        }

        fetchData()
    }, [])

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Restaurant Ratings Diagnostic</h1>

            <div className="space-y-4">
                {restaurants.map((restaurant) => {
                    const ratings = restaurant.ratings || []
                    const avgRating = ratings.length > 0
                        ? ratings.reduce((sum: number, r: any) => sum + r.score, 0) / ratings.length
                        : 0

                    return (
                        <div key={restaurant.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold">{restaurant.name}</h3>
                                    <p className="text-sm text-gray-500">{restaurant.neighbourhood}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">
                                        {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {ratings.length} rating{ratings.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>

                            {ratings.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {ratings.map((rating: any, idx: number) => (
                                        <div key={idx} className="text-sm bg-gray-50 p-2 rounded flex justify-between">
                                            <span>{rating.score.toFixed(1)}/10</span>
                                            <span className="text-gray-500">{rating.source || 'unknown'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold mb-2">Summary:</h3>
                <p>Total restaurants: {restaurants.length}</p>
                <p>With ratings: {restaurants.filter(r => r.ratings?.length > 0).length}</p>
                <p>Without ratings: {restaurants.filter(r => !r.ratings || r.ratings.length === 0).length}</p>
            </div>
        </div>
    )
}
