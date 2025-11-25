'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function AdminAddRestaurant() {
    const [restaurantName, setRestaurantName] = useState('')
    const [category, setCategory] = useState('burgers')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()

            // Get London city ID
            const { data: city } = await supabase
                .from('cities')
                .select('id')
                .eq('slug', 'london')
                .single()

            if (!city) {
                throw new Error('London city not found')
            }

            // Get category ID
            const { data: categoryData } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', category)
                .single()

            if (!categoryData) {
                throw new Error('Category not found')
            }

            // Insert restaurant
            const { data: restaurant, error: restaurantError } = await supabase
                .from('restaurants')
                .insert({
                    name: restaurantName,
                    city_id: city.id,
                    neighbourhood: 'London',
                    address: null,
                })
                .select()
                .single()

            if (restaurantError) throw restaurantError

            // Link to category
            const { error: linkError } = await supabase
                .from('restaurant_categories')
                .insert({
                    restaurant_id: restaurant.id,
                    category_id: categoryData.id,
                })

            if (linkError) throw linkError

            setMessage(`✅ Added ${restaurantName} to ${category}!`)
            setRestaurantName('')
        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-20">
            <header className="mb-8">
                <Link href="/" className="text-sm text-gray-500 mb-4 block">← Back to Home</Link>
                <h1 className="text-3xl font-black mb-1">Add Restaurant</h1>
                <p className="text-gray-500">Quick add for testing</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Restaurant Name</label>
                    <input
                        type="text"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., Five Guys"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="burgers">Burgers</option>
                        <option value="pizza">Pizza</option>
                        <option value="curry">Curry</option>
                        <option value="fried-chicken">Fried Chicken</option>
                        <option value="kebabs">Kebabs</option>
                        <option value="fish-and-chips">Fish & Chips</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Restaurant'}
                </button>

                {message && (
                    <div className={`p-4 rounded-lg ${message.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {message}
                    </div>
                )}
            </form>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Quick Add Burgers:</h3>
                <div className="space-y-2 text-sm">
                    <p>• Five Guys</p>
                    <p>• Shake Shack</p>
                    <p>• Honest Burgers</p>
                    <p>• Patty & Bun</p>
                    <p>• MEATliquor</p>
                </div>
            </div>
        </div>
    )
}
