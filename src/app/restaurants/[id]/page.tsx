import Link from 'next/link'
import { getRestaurant } from '@/lib/queries'
import { notFound } from 'next/navigation'

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const restaurant = await getRestaurant(id)

    if (!restaurant) {
        notFound()
    }

    return (
        <div className="max-w-md mx-auto bg-white min-h-screen">
            {/* Hero Image */}
            <div className="h-64 bg-gradient-to-br from-indigo-400 to-indigo-600 w-full relative">
                <Link href="/" className="absolute top-6 left-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
            </div>

            <div className="px-6 -mt-8 relative z-10 pb-12">
                {/* Main Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-6">
                    <h1 className="text-2xl font-black mb-1">{restaurant.name}</h1>
                    <p className="text-gray-500 text-sm mb-4">
                        {restaurant.neighbourhood}
                        {restaurant.categories && restaurant.categories.length > 0 && (
                            <> • {restaurant.categories.map(c => c.name).join(', ')}</>
                        )}
                    </p>

                    {restaurant.avg_rating > 0 && (
                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Average Rating</p>
                                <span className="text-4xl font-black text-indigo-600">{restaurant.avg_rating.toFixed(1)}</span>
                            </div>
                            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition">
                                Rate Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Ratings Section */}
                {restaurant.ratings && restaurant.ratings.length > 0 && (
                    <section className="mb-6">
                        <h3 className="font-bold text-gray-900 mb-3">Ratings ({restaurant.rating_count})</h3>
                        <div className="space-y-2">
                            {restaurant.ratings.map((rating) => (
                                <div key={rating.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-gray-900">{rating.score.toFixed(1)}/10</span>
                                        {rating.source && (
                                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                                {rating.source === 'google' ? '🌐 Google' : '👤 User'}
                                            </span>
                                        )}
                                    </div>
                                    {rating.review_text && (
                                        <p className="text-sm text-gray-600">{rating.review_text}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Multiple Locations */}
                {restaurant.neighbourhood === 'Multiple Locations' && restaurant.locations && restaurant.locations.length > 0 && (
                    <section className="mb-6">
                        <h3 className="font-bold text-gray-900 mb-3">Locations ({restaurant.locations.length})</h3>
                        <div className="space-y-2">
                            {restaurant.locations.map((location) => (
                                <div key={location.id} className="bg-white p-4 rounded-xl border border-gray-100">
                                    <p className="font-bold text-gray-900">{location.name}</p>
                                    {location.address && (
                                        <p className="text-sm text-gray-500 mt-1">{location.address}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Location */}
                {restaurant.address && (
                    <section>
                        <h3 className="font-bold text-gray-900 mb-3">Location</h3>
                        <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl w-full flex items-center justify-center text-gray-400 text-sm mb-2">
                            Map View
                        </div>
                        <p className="text-sm text-gray-500">{restaurant.address}</p>
                    </section>
                )}
            </div>
        </div>
    )
}
