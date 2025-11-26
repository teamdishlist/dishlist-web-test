import Link from 'next/link'
import { getRestaurant } from '@/lib/queries'
import { notFound } from 'next/navigation'
import RestaurantMap from '@/components/RestaurantMap'
import AddToMyListButton from '@/components/AddToMyListButton'
import RateButton from '@/components/RateButton'

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const restaurant = await getRestaurant(id)

    if (!restaurant) {
        notFound()
    }

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

    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-72 bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90" />

                {/* Back Button */}
                <Link href="/categories/burgers" className="absolute top-6 left-4 z-10 bg-white/20 backdrop-blur-md p-2.5 rounded-full hover:bg-white/30 transition border border-white/10 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-20">
                    <div className="flex items-end justify-between mb-2">
                        <h1 className="text-3xl font-black text-white leading-tight">{restaurant.name}</h1>
                        {restaurant.avg_rating > 0 && (
                            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/10">
                                <span className="text-2xl font-black text-white">{restaurant.avg_rating.toFixed(1)}</span>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-white/80">Rating</span>
                            </div>
                        )}
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                        {restaurant.neighbourhood}
                        {restaurant.categories && restaurant.categories.length > 0 && (
                            <> • {restaurant.categories.map((c: any) => c.name).join(', ')}</>
                        )}
                    </p>
                </div>
            </div>

            <div className="px-5 -mt-6 relative z-10 space-y-6">
                {/* Action Buttons */}
                <div className="bg-white rounded-2xl p-4 shadow-xl shadow-indigo-100/50 border border-gray-100 flex flex-col gap-3">
                    <AddToMyListButton restaurantId={restaurant.id} />
                    <RateButton restaurantId={restaurant.id} />
                </div>

                {/* Map Section */}
                <section>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Location{locations.length > 1 ? 's' : ''}
                    </h3>
                    <RestaurantMap
                        lat={restaurant.lat}
                        lng={restaurant.lng}
                        locations={locations}
                    />
                    {restaurant.address && locations.length <= 1 && (
                        <p className="text-sm text-gray-500 mt-3 ml-1">{restaurant.address}</p>
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
                </section>

                {/* Ratings Breakdown */}
                {restaurant.ratings && restaurant.ratings.length > 0 && (
                    <section>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Ratings & Reviews
                        </h3>
                        <div className="space-y-3">
                            {restaurant.ratings.map((rating: any) => (
                                <div key={rating.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-gray-900">{rating.score.toFixed(1)}</span>
                                            <span className="text-xs font-bold text-gray-400 uppercase">/ 10</span>
                                        </div>
                                        {rating.source && (
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${rating.source === 'google'
                                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                }`}>
                                                {rating.source === 'google' ? 'Google' : 'User'}
                                            </span>
                                        )}
                                    </div>
                                    {rating.review_text && (
                                        <p className="text-sm text-gray-600 leading-relaxed">{rating.review_text}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
