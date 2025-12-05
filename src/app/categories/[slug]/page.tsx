import Link from 'next/link'
import Image from 'next/image'
import { getCategoryRestaurants, getCityBySlug, getRestaurant } from '@/lib/mock-queries'
import { MOCK_USER_ID } from '@/lib/dummy-data'
import Header from '@/components/Header'
import MobileListHeader from '@/components/MobileListHeader'

// Trend function to match dishlist 100
const getTrend = (index: number): 'up' | 'down' | 'same' => {
    const pattern = ['up', 'same', 'down', 'up', 'same', 'down', 'same', 'up']
    return pattern[index % pattern.length] as 'up' | 'down' | 'same'
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // Get London city (hardcoded for MVP)
    const city = await getCityBySlug('london')

    if (!city) {
        return <div>City not found</div>
    }

    const restaurants = await getCategoryRestaurants(slug, city.id)

    // Fetch full details with user ratings for each restaurant
    const restaurantsWithUserRatings = await Promise.all(
        restaurants.map(r => getRestaurant(r.id, MOCK_USER_ID))
    ).then(results => results.filter(r => r !== null))

    // Format category name
    const categoryName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    // Get category emoji
    const categoryEmoji = slug === 'pizza' ? '🍕' :
        slug === 'burgers' ? '🍔' :
            slug === 'fried-chicken' ? '🍗' :
                slug === 'kebabs' ? '🥙' :
                    slug === 'curry' ? '🍛' :
                        slug === 'fish-and-chips' ? '🐟' :
                            slug === 'guinness' ? '🍺' : '🍽️'

    // Get category logo path
    const categoryLogoMap: { [key: string]: string } = {
        'pizza': '/food-logos/Property 1=Pizza.svg',
        'burgers': '/food-logos/Property 1=Burgers.svg',
        'fried-chicken': '/food-logos/Property 1=Fried Chicken.svg',
        'kebabs': '/food-logos/Property 1=Kebab.svg',
        'curry': '/food-logos/Property 1=Curry.svg',
        'fish-and-chips': '/food-logos/Property 1=Fish & Chips.svg',
        'guinness': '/food-logos/Property 1=Guinness.svg'
    }

    const categoryLogo = categoryLogoMap[slug] || '/food-logos/Property 1=Burgers.svg'

    // Get category background path
    const categoryBackgroundMap: { [key: string]: string } = {
        'pizza': '/category-backgrounds/Property 1=Pizza.svg',
        'burgers': '/category-backgrounds/Property 1=Burgers.svg',
        'fried-chicken': '/category-backgrounds/Property 1=Fried Chicken.svg',
        'kebabs': '/category-backgrounds/Property 1=Kebab.svg',
        'curry': '/category-backgrounds/Property 1=Curry.svg',
        'fish-and-chips': '/category-backgrounds/Property 1=Fish & Chips.svg',
        'guinness': '/category-backgrounds/Property 1=Guinness.svg'
    }

    const categoryBackground = categoryBackgroundMap[slug] || '/category-backgrounds/Property 1=Burgers.svg'

    return (
        <div className="w-full min-h-screen" style={{ background: '#1E1947' }}>
            <Header />
            <MobileListHeader 
                title={categoryName}
                backgroundImage={categoryBackground}
                logoImage={categoryLogo}
                logoSize={
                    slug === 'guinness' ? { width: 160, height: 60 } :
                    slug === 'fish-and-chips' ? { width: 180, height: 68 } :
                    undefined
                }
            />
            <div className="max-w-md mx-auto relative">
                {/* Content Container */}
                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Table Container (The Sheet) */}
                    <div className="flex-1 overflow-hidden" style={{ background: '#FFFFFF', marginTop: '0' }}>
                    {/* Table Items */}
                    <div>
                        {restaurantsWithUserRatings.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>No restaurants yet in this category.</p>
                                <Link href="/submit" className="text-indigo-600 font-medium mt-2 inline-block">
                                    Add the first one →
                                </Link>
                            </div>
                        ) : (
                            restaurantsWithUserRatings.map((restaurant, index) => (
                                <Link
                                    key={restaurant.id}
                                    href={`/restaurants/${restaurant.id}`}
                                    className="flex items-center gap-2 px-4 transition hover:opacity-80"
                                    style={{
                                        background: index % 2 === 0 ? '#FFFFFF' : '#F6F2F1',
                                        paddingTop: '18px',
                                        paddingBottom: '18px',
                                        height: '72px'
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
                                            <span className="text-2xl">{categoryEmoji}</span>
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

                                    {/* Right Side - Rating & Trend */}
                                    <div className="flex items-center gap-2">
                                        {/* User Rating or Add Button */}
                                        {restaurant.user_rating ? (
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
                                                    {restaurant.user_rating.score.toFixed(1)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div
                                                className="flex items-center justify-center px-3 rounded-full"
                                                style={{
                                                    border: '2px dashed #E3DAD9',
                                                    height: '32px',
                                                    minWidth: '48px'
                                                }}
                                            >
                                                <svg className="w-3 h-3" style={{ color: '#180400' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Average Rating with Trend Indicator */}
                                        <div className="flex items-center gap-1.5">
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
                                            {/* Trend indicator */}
                                            {(() => {
                                                const trend = getTrend(index)
                                                return (
                                                    <Image
                                                        src={`/rating-indicators /trend=${trend}.svg`}
                                                        alt={`trend ${trend}`}
                                                        width={16}
                                                        height={16}
                                                    />
                                                )
                                            })()}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}
