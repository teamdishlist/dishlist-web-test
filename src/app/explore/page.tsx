'use client'

import Link from 'next/link'
import { useCity } from '@/contexts/CityContext'

const EXPLORE_CATEGORIES = [
    { name: 'Pizza', slug: 'pizza', emoji: '🍕', count: 142 },
    { name: 'Burgers', slug: 'burgers', emoji: '🍔', count: 98 },
    { name: 'Fried Chicken', slug: 'fried-chicken', emoji: '🍗', count: 65 },
    { name: 'Kebabs', slug: 'kebabs', emoji: '🥙', count: 45 },
    { name: 'Curry', slug: 'curry', emoji: '🍛', count: 88 },
    { name: 'Fish & Chips', slug: 'fish-and-chips', emoji: '🐟', count: 32 },
    { name: 'Guinness', slug: 'guinness', emoji: '🍺', count: 12 },
    { name: 'Sushi', slug: 'sushi', emoji: '🍣', count: 56 },
    { name: 'Pasta', slug: 'pasta', emoji: '🍝', count: 74 },
    { name: 'Tacos', slug: 'tacos', emoji: '🌮', count: 28 },
]

export default function ExplorePage() {
    const { currentCity } = useCity()

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-20">
            <header className="mb-6">
                <h1 className="text-3xl font-black mb-1">Explore {currentCity.name}</h1>
                <p className="text-gray-500">Find the best food by category</p>
            </header>

            {/* Map Teaser */}
            <div className="bg-gray-100 rounded-2xl h-48 mb-8 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition"></div>
                <div className="text-center z-10">
                    <span className="text-4xl mb-2 block">🗺️</span>
                    <span className="font-bold text-gray-900">Map View</span>
                    <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {EXPLORE_CATEGORIES.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-100 transition active:scale-95"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-3xl">{cat.emoji}</span>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                {cat.count}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-900">{cat.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    )
}
