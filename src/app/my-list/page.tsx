'use client'

import Link from 'next/link'
import { useCity } from '@/contexts/CityContext'

// Placeholder data
const MY_LIST_ITEMS = [
    { id: 1, name: 'Pizza Pilgrims', category: 'Pizza', rating: 9.2, review: 'Best crust in London, hands down.', location: 'Soho' },
    { id: 2, name: 'Bleeker Burger', category: 'Burgers', rating: 8.9, review: 'Simple, juicy, perfect meat blend.', location: 'Victoria' },
    { id: 3, name: 'Dishoom', category: 'Curry', rating: 8.7, review: 'Black daal is legendary for a reason.', location: 'Shoreditch' },
]

export default function MyList() {
    const { currentCity } = useCity()

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-20">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/" className="text-2xl">←</Link>
                <h1 className="text-2xl font-bold">My List</h1>
            </header>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-sm">
                    All
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition">
                    {currentCity.name}
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition">
                    Highest Rated
                </button>
            </div>

            <div className="space-y-4">
                {MY_LIST_ITEMS.map((item, index) => (
                    <Link href={`/restaurants/${item.id}`} key={item.id} className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition active:scale-[0.99]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className="font-black text-indigo-600 text-2xl w-8 text-center">#{index + 1}</span>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                                    <p className="text-xs text-gray-500">{item.category} • {item.location}</p>
                                </div>
                            </div>
                            <div className="bg-black text-white font-bold text-sm px-3 py-1.5 rounded-lg shrink-0">
                                {item.rating}
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm pl-11 italic">"{item.review}"</p>
                    </Link>
                ))}
            </div>

            <div className="mt-8 text-center">
                <Link href="/submit" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition active:scale-95">
                    + Add Restaurant
                </Link>
            </div>
        </div>
    )
}
