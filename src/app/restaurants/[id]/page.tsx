import Link from 'next/link'
import { getRestaurant } from '@/lib/mock-queries'
import { notFound } from 'next/navigation'
import RestaurantMap from '@/components/RestaurantMap'
import { MOCK_USER_ID } from '@/lib/dummy-data'

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const restaurant = await getRestaurant(id, MOCK_USER_ID)

    if (!restaurant) {
        notFound()
    }

    // Check if user has rated this restaurant
    const userRating = restaurant.user_rating

    // Determine locations for map
    const locations = restaurant.locations && restaurant.locations.length > 0
        ? restaurant.locations.map((l: any) => ({
            lat: l.lat,
            lng: l.lng,
            name: l.name,
            address: l.address
        }))
        : restaurant.lat && restaurant.lng
            ? [{ lat: restaurant.lat, lng: restaurant.lng, name: restaurant.name, address: restaurant.address }]
            : []

    // Get category emoji
    const categoryEmoji = restaurant.categories?.[0]?.slug === 'pizza' ? '🍕' :
        restaurant.categories?.[0]?.slug === 'burgers' ? '🍔' :
            restaurant.categories?.[0]?.slug === 'fried-chicken' ? '🍗' :
                restaurant.categories?.[0]?.slug === 'kebabs' ? '🥙' :
                    restaurant.categories?.[0]?.slug === 'curry' ? '🍛' :
                        restaurant.categories?.[0]?.slug === 'fish-and-chips' ? '🐟' :
                            restaurant.categories?.[0]?.slug === 'guinness' ? '🍺' : '🍽️'

    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white px-5 pt-6 pb-4">
                {/* Back Button */}
                <Link href="/" className="inline-block mb-4">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>

                {/* Rating Badge */}
                <div className="flex justify-center mb-4">
                    <div className="bg-green-500 text-white rounded-2xl px-6 py-3 shadow-lg">
                        <div className="text-4xl font-black text-center">{restaurant.avg_rating.toFixed(1)}</div>
                        <div className="text-xs font-medium text-center opacity-90">/ 10</div>
                    </div>
                </div>

                {/* Restaurant Name */}
                <h1 className="text-2xl font-black text-gray-900 text-center mb-2">{restaurant.name}</h1>

                {/* Category Tags */}
                <div className="flex justify-center gap-2 mb-4">
                    {restaurant.categories?.map((category: any) => (
                        <div key={category.id} className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                            <span className="text-sm">{categoryEmoji}</span>
                            <span className="text-xs font-medium text-gray-700">{category.name}</span>
                        </div>
                    ))}
                    {restaurant.neighbourhood && (
                        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                            <span className="text-sm">📍</span>
                            <span className="text-xs font-medium text-gray-700">{restaurant.neighbourhood}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-5 space-y-4">
                {/* User Rating Section */}
                {userRating ? (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Your Rating</span>
                            <button className="text-xs font-bold text-indigo-600 uppercase">Edit</button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 text-white rounded-xl px-4 py-2">
                                <div className="text-2xl font-black">{userRating.score.toFixed(1)}</div>
                            </div>
                            <p className="text-sm text-gray-600 flex-1 italic">"{userRating.review_text}"</p>
                        </div>
                    </div>
                ) : (
                    <button className="w-full bg-indigo-600 text-white rounded-2xl p-6 shadow-lg hover:bg-indigo-700 transition active:scale-[0.98]">
                        <div className="text-5xl mb-2">⭐</div>
                        <div className="text-xl font-black mb-1">Rate this</div>
                        <div className="text-sm opacity-90">Share your experience</div>
                    </button>
                )}

                {/* Rankings Section */}
                <section>
                    <h3 className="font-bold text-gray-900 mb-3">Rankings</h3>
                    <div className="space-y-2">
                        {/* DishList100 */}
                        {restaurant.avg_rating >= 8.5 && (
                            <div className="bg-indigo-600 text-white rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🏆</span>
                                    <span className="font-bold text-sm">DishList100</span>
                                </div>
                                <span className="text-2xl font-black">#12</span>
                            </div>
                        )}

                        {/* Category Ranking */}
                        <div className="bg-white border-2 border-indigo-600 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{categoryEmoji}</span>
                                <span className="font-bold text-sm text-gray-900">Best {restaurant.categories?.[0]?.name}</span>
                            </div>
                            <span className="text-2xl font-black text-indigo-600">#2</span>
                        </div>

                        {/* Wishlist */}
                        {userRating && (
                            <div className="bg-green-500 text-white rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">❤️</span>
                                    <span className="font-bold text-sm">Your Wishlist</span>
                                </div>
                                <span className="text-2xl font-black">#1</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Wishlist Section */}
                <div className="bg-green-500 text-white rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-full p-2">
                            <span className="text-2xl">❤️</span>
                        </div>
                        <div>
                            <div className="font-bold text-sm">Added to your list</div>
                            <div className="text-xs opacity-90">#{userRating ? '1' : '—'}</div>
                        </div>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 transition rounded-lg px-3 py-1.5 text-xs font-bold">
                        View
                    </button>
                </div>

                {/* Order & Book Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-600 transition">
                        <div className="text-3xl mb-1">🛵</div>
                        <div className="font-bold text-sm text-gray-900">Order</div>
                    </button>
                    <button className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-600 transition">
                        <div className="text-3xl mb-1">📅</div>
                        <div className="font-bold text-sm text-gray-900">Book</div>
                    </button>
                </div>

                {/* Map Section */}
                <section>
                    <h3 className="font-bold text-gray-900 mb-3">Where</h3>
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                        <RestaurantMap
                            lat={restaurant.lat}
                            lng={restaurant.lng}
                            locations={locations}
                        />
                    </div>
                    {restaurant.address && locations.length <= 1 && (
                        <p className="text-sm text-gray-500 mt-2">{restaurant.address}</p>
                    )}
                    {locations.length > 1 && (
                        <div className="mt-3 space-y-2">
                            {locations.map((loc: any, idx: number) => (
                                <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 text-sm">
                                    <p className="font-bold text-gray-900">{loc.name}</p>
                                    <p className="text-gray-500">{loc.address}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <button className="w-full mt-3 bg-indigo-600 text-white rounded-xl py-3 font-bold text-sm hover:bg-indigo-700 transition">
                        Get Directions
                    </button>
                </section>

                {/* Reviews Section */}
                {restaurant.ratings && restaurant.ratings.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900">Reviews</h3>
                            <div className="flex items-center gap-1">
                                <span className="text-xl">⭐</span>
                                <span className="font-black text-gray-900">{restaurant.avg_rating.toFixed(1)}</span>
                                <span className="text-sm text-gray-500">/ 10</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {restaurant.ratings.slice(0, 3).map((rating: any) => (
                                <div key={rating.id} className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-gray-900">{rating.score.toFixed(1)}</span>
                                            <span className="text-xs font-bold text-gray-400">/ 10</span>
                                        </div>
                                        {rating.source && (
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${rating.source === 'google'
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'bg-indigo-50 text-indigo-600'
                                                }`}>
                                                {rating.source === 'google' ? 'Google' : 'User'}
                                            </span>
                                        )}
                                    </div>
                                    {rating.review_text && (
                                        <p className="text-sm text-gray-600 leading-relaxed">"{rating.review_text}"</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        {restaurant.ratings.length > 3 && (
                            <button className="w-full mt-3 text-indigo-600 font-bold text-sm py-2">
                                View all {restaurant.ratings.length} reviews →
                            </button>
                        )}
                    </section>
                )}

                {/* About Section */}
                <section>
                    <h3 className="font-bold text-gray-900 mb-3">About</h3>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {restaurant.categories?.[0]?.name === 'Pizza' && "Authentic Neapolitan pizza made with the finest ingredients. Our dough is made fresh daily and cooked in a traditional wood-fired oven."}
                            {restaurant.categories?.[0]?.name === 'Burgers' && "Serving the best burgers in London with premium quality beef, fresh ingredients, and our secret sauce blend."}
                            {restaurant.categories?.[0]?.name === 'Curry' && "Experience authentic Indian cuisine with traditional recipes passed down through generations."}
                            {!['Pizza', 'Burgers', 'Curry'].includes(restaurant.categories?.[0]?.name || '') && "A beloved local favorite serving delicious food with quality ingredients and excellent service."}
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Opening hours</div>
                                <div className="text-sm font-bold text-gray-900">11:00 - 23:00</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Price range</div>
                                <div className="text-sm font-bold text-gray-900">££</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Cuisine type</div>
                                <div className="text-sm font-bold text-gray-900">{restaurant.categories?.[0]?.name}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Seating</div>
                                <div className="text-sm font-bold text-gray-900">Indoor</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured On Section */}
                <section>
                    <h3 className="font-bold text-gray-900 mb-3">Featured on</h3>
                    <div className="space-y-2">
                        <div className="bg-white rounded-xl p-3 border border-gray-200 flex items-center justify-between">
                            <div>
                                <div className="font-bold text-sm text-gray-900">Timeout</div>
                                <div className="text-xs text-gray-500">Best {restaurant.categories?.[0]?.name} in London</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-200 flex items-center justify-between">
                            <div>
                                <div className="font-bold text-sm text-gray-900">The Infatuation</div>
                                <div className="text-xs text-gray-500">Where to eat in {restaurant.neighbourhood}</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
