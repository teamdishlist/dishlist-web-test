'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

export default function PopulateBurgers() {
    const [loading, setLoading] = useState(false)
    const [log, setLog] = useState<string[]>([])
    const [count, setCount] = useState(0)

    const addLog = (message: string) => {
        setLog(prev => [...prev, message])
        console.log(message)
    }

    const fetchAndPopulate = async () => {
        setLoading(true)
        setLog([])
        setCount(0)

        try {
            addLog('🔍 Fetching burger restaurants from Google Places...')

            // Fetch from our API route (which proxies to Google)
            const response = await fetch('/api/places/search?query=burger+restaurant+in+London')

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            if (data.status !== 'OK') {
                throw new Error(`Google API error: ${data.status} - ${data.error_message || ''}`)
            }

            addLog(`✅ Found ${data.results.length} restaurants`)

            const supabase = createClient()

            // Get London city
            const { data: city } = await supabase
                .from('cities')
                .select('id')
                .eq('slug', 'london')
                .single()

            if (!city) throw new Error('London city not found')

            // Get burgers category
            const { data: category } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', 'burgers')
                .single()

            if (!category) throw new Error('Burgers category not found')

            // Log all restaurants from Google
            addLog(`\n📊 All restaurants from Google:`)
            data.results.slice(0, 100).forEach((place: any, idx: number) => {
                addLog(`${idx + 1}. ${place.name} - Rating: ${place.rating || 'NO RATING'}`)
            })

            // Helper to extract neighborhood from address_components
            const extractNeighbourhood = (addressComponents: any[]) => {
                if (!addressComponents) return 'London'

                // Try to find sublocality (e.g., Soho, Shoreditch)
                const sublocality = addressComponents.find((c: any) =>
                    c.types.includes('sublocality') || c.types.includes('neighborhood')
                )
                if (sublocality) return sublocality.long_name

                // Fall back to postal_town
                const postalTown = addressComponents.find((c: any) =>
                    c.types.includes('postal_town')
                )
                if (postalTown) return postalTown.long_name

                return 'London'
            }

            const restaurantsToAdd = data.results
                .slice(0, 100)  // Increased from 30 to 100
                .filter((place: any) => {
                    const hasRating = place.rating && place.rating >= 3.5
                    if (!hasRating) {
                        addLog(`⏭️  Skipping ${place.name} - Rating: ${place.rating || 'none'}`)
                    }
                    return hasRating
                })
                .map((place: any) => ({
                    name: place.name,
                    neighbourhood: extractNeighbourhood(place.address_components),
                    address: place.formatted_address,
                    lat: place.geometry?.location?.lat,
                    lng: place.geometry?.location?.lng,
                    google_place_id: place.place_id,
                    rating: place.rating
                }))

            addLog(`\nPrepared ${restaurantsToAdd.length} restaurants to add...`)

            // Call admin API to insert (bypasses RLS)
            const insertResponse = await fetch('/api/admin/add-restaurants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurants: restaurantsToAdd,
                    categorySlug: 'burgers'
                })
            })

            const insertData = await insertResponse.json()

            if (insertData.error) {
                throw new Error(insertData.error)
            }

            let inserted = 0
            let failed = 0

            for (const result of insertData.results) {
                if (result.success) {
                    addLog(`✅ ${result.name}`)
                    inserted++
                } else {
                    addLog(`❌ ${result.name}: ${result.error}`)
                    failed++
                }
            }

            setCount(inserted)
            addLog(`\n📊 Summary:`)
            addLog(`   ✅ Added: ${inserted}`)
            addLog(`   ❌ Failed: ${failed}`)
            addLog(`\n🎉 Done!`)
        } catch (error: any) {
            addLog(`❌ Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-20">
            <header className="mb-8">
                <Link href="/" className="text-sm text-gray-500 mb-4 block">← Back to Home</Link>
                <h1 className="text-3xl font-black mb-1">Populate Burgers from Google</h1>
                <p className="text-gray-500">Fetch and add burger restaurants from Google Places API</p>
            </header>

            <button
                onClick={fetchAndPopulate}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 mb-6"
            >
                {loading ? '⏳ Fetching...' : '🍔 Fetch Burger Restaurants'}
            </button>

            {count > 0 && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                    <p className="text-green-800 font-bold">✅ Added {count} restaurants!</p>
                    <Link href="/categories/burgers" className="text-indigo-600 font-medium text-sm">
                        View burgers category →
                    </Link>
                </div>
            )}

            {log.length > 0 && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
                    {log.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            )}
        </div>
    )
}
