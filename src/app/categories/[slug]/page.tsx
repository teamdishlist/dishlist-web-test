'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCity } from '@/contexts/CityContext'

// Placeholder data generator
const generateList = (category: string) => Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `${category} Place ${i + 1}`,
    rating: (9.5 - (i * 0.2)).toFixed(1),
    location: ['Soho', 'Shoreditch', 'Hackney', 'Brixton', 'Covent Garden'][i % 5]
}))

export default function CategoryPage() {
    const params = useParams()
    const { currentCity } = useCity()
    const categorySlug = params.slug as string

    // Format category name (e.g. fried-chicken -> Fried Chicken)
    const categoryName = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    const items = generateList(categoryName)

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-20">
            <header className="mb-8">
                <Link href="/" className="text-sm text-gray-500 mb-4 block">← Back to Home</Link>
                <h1 className="text-3xl font-black mb-1">{currentCity.name} {categoryName}</h1>
                <p className="text-gray-500 font-medium">Top 100</p>
            </header>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <Link
                        href={`/restaurants/${item.id}`}
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition active:scale-[0.99]"
                    >
                        <span className={`font-black text-2xl w-10 text-center ${index < 3 ? 'text-indigo-600' : 'text-gray-400'
                            }`}>
                            {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                            <p className="text-xs text-gray-500">{item.location}</p>
                        </div>
                        <div className="font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg text-sm shrink-0">
                            {item.rating}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
