import Link from 'next/link'
import { getCategoryRestaurants } from '@/lib/queries'
import { createClient } from '@/utils/supabase/server'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    // Get London city ID (hardcoded for MVP)
    const { data: city } = await supabase
        .from('cities')
        .select('id, name')
        .eq('slug', 'london')
        .single()

    if (!city) {
        return <div>City not found</div>
    }

    const restaurants = await getCategoryRestaurants(slug, city.id)

    // Format category name
    const categoryName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-20">
            <header className="mb-8">
                <Link href="/" className="text-sm text-gray-500 mb-4 block">← Back to Home</Link>
                <h1 className="text-3xl font-black mb-1">{city.name} {categoryName}</h1>
                <p className="text-gray-500 font-medium">Top {restaurants.length}</p>
            </header>

            <div className="space-y-3">
                {restaurants.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No restaurants yet in this category.</p>
                        <Link href="/submit" className="text-indigo-600 font-medium mt-2 inline-block">
                            Add the first one →
                        </Link>
                    </div>
                ) : (
                    restaurants.map((restaurant, index) => (
                        <Link
                            href={`/restaurants/${restaurant.id}`}
                            key={restaurant.id}
                            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition active:scale-[0.99]"
                        >
                            <span className={`font-black text-2xl w-10 text-center ${index < 3 ? 'text-indigo-600' : 'text-gray-400'
                                }`}>
                                {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{restaurant.name}</h3>
                                <p className="text-xs text-gray-500">{restaurant.neighbourhood || 'London'}</p>
                            </div>
                            <div className="font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg text-sm shrink-0">
                                {restaurant.avg_rating > 0 ? restaurant.avg_rating.toFixed(1) : '—'}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
