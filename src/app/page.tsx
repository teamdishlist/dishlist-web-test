import Link from 'next/link'
import { getCategories } from '@/lib/mock-queries'

export default async function Home() {
    const categories = await getCategories()

    return (
        <div className="max-w-md mx-auto px-4 pt-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">DishList</h1>
                    <button className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        London ▾
                    </button>
                </div>
                <Link href="/my-list" className="text-sm font-medium text-indigo-600">
                    My List
                </Link>
            </header>

            {/* DishList 100 Card */}
            <Link href={`/dishlist-100`} className="block mb-8">
                <div className="bg-black text-white p-6 rounded-2xl shadow-lg transform transition active:scale-95">
                    <h2 className="text-3xl font-black mb-1">DishList 100</h2>
                    <p className="text-gray-300 text-sm">The definitive top 100 for London</p>
                </div>
            </Link>

            {/* Categories Grid */}
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 aspect-square hover:border-indigo-100 transition active:scale-95"
                    >
                        <span className="text-4xl">
                            {cat.slug === 'pizza' && '🍕'}
                            {cat.slug === 'burgers' && '🍔'}
                            {cat.slug === 'fried-chicken' && '🍗'}
                            {cat.slug === 'kebabs' && '🥙'}
                            {cat.slug === 'curry' && '🍛'}
                            {cat.slug === 'fish-and-chips' && '🐟'}
                            {cat.slug === 'guinness' && '🍺'}
                        </span>
                        <span className="font-medium text-sm">{cat.name}</span>
                    </Link>
                ))}
            </div>

            {/* Explore Teaser */}
            <div className="bg-indigo-50 p-6 rounded-2xl mb-8 text-center">
                <h3 className="font-bold text-indigo-900 mb-2">Explore Nearby</h3>
                <p className="text-indigo-700 text-sm mb-4">Find the best food around you</p>
                <Link href="/explore" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    Open Map
                </Link>
            </div>
        </div>
    )
}
