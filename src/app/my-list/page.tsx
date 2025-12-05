import Link from 'next/link'
import Image from 'next/image'
import { getMyList, getRestaurant } from '@/lib/mock-queries'
import { MOCK_USER_ID, RATINGS } from '@/lib/dummy-data'
import Header from '@/components/Header'

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

    // Filter out null restaurants and sort by user rating (if available) or position
    const validRestaurants = myListWithDetails
        .filter(item => item.restaurant !== null)
        .sort((a, b) => {
            // Sort by user rating if available, otherwise by position
            if (a.userRating && b.userRating) {
                return b.userRating.score - a.userRating.score
            }
            if (a.userRating) return -1
            if (b.userRating) return 1
            const aPos = a.position ?? 0
            const bPos = b.position ?? 0
            return aPos - bPos
        })

    return (
        <div className="w-full min-h-screen" style={{ background: '#1E1947' }}>
            <Header />
            <div className="max-w-md mx-auto">

            {/* Table Container */}
            <div className="overflow-hidden" style={{ background: '#FFFFFF' }}>
                {/* Table Items */}
                <div>
                    {validRestaurants.map((item, index) => {
                        const restaurant = item.restaurant
                        if (!restaurant) return null

                        return (
                            <Link
                                key={item.id}
                                href={`/restaurants/${restaurant.id}`}
                                className="flex items-center gap-2 px-4 transition hover:opacity-80"
                                style={{
                                    background: index % 2 === 0 ? '#FFFFFF' : '#F6F2F1',
                                    height: '72px',
                                    paddingTop: '18px',
                                    paddingBottom: '18px'
                                }}
                            >
                                {/* Left Side - Rank & Restaurant Info */}
                                <div className="flex items-center gap-2 flex-1">
                                    {/* Rank & Category Emoji */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="font-bold flex items-center"
                                            style={{
                                                fontFamily: 'Sofia Sans, sans-serif',
                                                fontSize: '16px',
                                                lineHeight: '19px',
                                                color: '#180400',
                                                width: '20px'
                                            }}
                                        >
                                            {index + 1}
                                        </span>
                                        <span className="text-2xl">
                                            {restaurant.categories?.[0]?.slug === 'pizza' ? '🍕' :
                                                restaurant.categories?.[0]?.slug === 'burgers' ? '🍔' :
                                                    restaurant.categories?.[0]?.slug === 'fried-chicken' ? '🍗' :
                                                        restaurant.categories?.[0]?.slug === 'kebabs' ? '🥙' :
                                                            restaurant.categories?.[0]?.slug === 'curry' ? '🍛' :
                                                                restaurant.categories?.[0]?.slug === 'fish-and-chips' ? '🐟' :
                                                                    restaurant.categories?.[0]?.slug === 'guinness' ? '🍺' : '🍽️'}
                                        </span>
                                    </div>

                                    {/* Restaurant Name & Location */}
                                    <div className="flex flex-col justify-center gap-1 flex-1">
                                        <span
                                            className="font-bold flex items-center"
                                            style={{
                                                fontFamily: 'Sofia Sans, sans-serif',
                                                fontSize: '16px',
                                                lineHeight: '19px',
                                                color: '#180400'
                                            }}
                                        >
                                            {restaurant.name}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 0C7.32608 0 8.59747 0.527162 9.53516 1.46484C10.4728 2.40253 11 3.67392 11 5C11 6.95085 9.75812 8.69776 8.61328 9.90625C8.03061 10.5213 7.44939 11.022 7.01465 11.3682C6.79706 11.5414 6.6149 11.6767 6.48633 11.7695C6.42199 11.816 6.37047 11.8524 6.33496 11.877C6.31739 11.8891 6.30361 11.8987 6.29395 11.9053L6.2793 11.915L6.27832 11.916H6.27734C6.1305 12.0139 5.9447 12.0264 5.78809 11.9531L5.72266 11.916L5.7207 11.915L5.70605 11.9053C5.69639 11.8987 5.68261 11.8891 5.66504 11.877C5.62953 11.8524 5.57801 11.816 5.51367 11.7695C5.3851 11.6767 5.20294 11.5414 4.98535 11.3682C4.55061 11.022 3.96939 10.5213 3.38672 9.90625C2.24188 8.69776 1 6.95085 1 5C1 3.67392 1.52716 2.40253 2.46484 1.46484C3.40253 0.527162 4.67392 0 6 0ZM6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5Z" fill="#FF2D55" />
                                            </svg>
                                            <span
                                                className="flex items-center"
                                                style={{
                                                    fontFamily: 'Sofia Sans, sans-serif',
                                                    fontSize: '14px',
                                                    lineHeight: '17px',
                                                    color: '#3D0900'
                                                }}
                                            >
                                                {restaurant.locations && restaurant.locations.length > 1
                                                    ? 'Multiple locations'
                                                    : restaurant.neighbourhood}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Dishlist Rating & User Rating */}
                                <div className="flex items-center gap-2">
                                    {/* Dishlist Rating (left) */}
                                    <span
                                        className="font-bold text-center"
                                        style={{
                                            fontFamily: 'Sofia Sans, sans-serif',
                                            fontSize: '16px',
                                            lineHeight: '19px',
                                            color: '#180400'
                                        }}
                                    >
                                        {restaurant.avg_rating.toFixed(1)}
                                    </span>
                                    
                                    {/* User Rating (right) - Always show purple box since restaurants in My List are rated */}
                                    <div
                                        className="flex items-center justify-center px-3 rounded-full"
                                        style={{
                                            background: '#3F2CD1',
                                            height: '32px',
                                            minWidth: '48px'
                                        }}
                                    >
                                        <span
                                            className="font-bold text-center"
                                            style={{
                                                fontFamily: 'Sofia Sans, sans-serif',
                                                fontSize: '16px',
                                                lineHeight: '19px',
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            {item.userRating ? item.userRating.score.toFixed(1) : restaurant.avg_rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
            </div>
        </div>
    )
}
