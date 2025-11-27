import Link from 'next/link'
import { getMyList, getRestaurant } from '@/lib/mock-queries'
import { MOCK_USER_ID, RATINGS } from '@/lib/dummy-data'

export default async function MyList() {
    // Get user's list
    const myListEntries = await getMyList(MOCK_USER_ID)

    // Fetch full restaurant details with ratings for each entry
    const myListWithDetails = await Promise.all(
        myListEntries.map(async (entry) => {
            const restaurant = await getRestaurant(entry.restaurant_id, MOCK_USER_ID)
            // Get user's rating for this restaurant
            const userRating = RATINGS.find(
                r => r.restaurant_id === entry.restaurant_id && r.user_id === MOCK_USER_ID
            )
            return {
                ...entry,
                restaurant,
                userRating
            }
        })
    )

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
                    London
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition">
                    Highest Rated
                </button>
            </div>

            <div className="space-y-4">
                {myListWithDetails.map((item, index) => {
                    const restaurant = item.restaurant
                    if (!restaurant) return null

                    const categoryName = restaurant.categories?.[0]?.name || 'Restaurant'
                    const rating = restaurant.avg_rating || 0
                    const review = item.userRating?.review_text || 'No review yet'

                    return (
                        <Link
                            href={`/restaurants/${restaurant.id}`}
                            key={item.id}
                            className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition active:scale-[0.99]"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-indigo-600 text-2xl w-8 text-center">#{index + 1}</span>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">{restaurant.name}</h3>
                                        <p className="text-xs text-gray-500">{categoryName} • {restaurant.neighbourhood || 'London'}</p>
                                    </div>
                                </div>
                                <div className="bg-black text-white font-bold text-sm px-3 py-1.5 rounded-lg shrink-0">
                                    {rating > 0 ? rating.toFixed(1) : '—'}
                                </div>
                            </div>
                            {review && (
                                <p className="text-gray-600 text-sm pl-11 italic">"{review}"</p>
                            )}
                        </Link>
                    )
                })}
            </div>

            <div className="mt-8 text-center">
                <Link href="/submit" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition active:scale-95">
                    + Add Restaurant
                </Link>
            </div>
        </div>
    )
}
