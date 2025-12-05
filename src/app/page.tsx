import Link from 'next/link'
import Image from 'next/image'
import RestaurantMap from '@/components/RestaurantMap'
import RankingTicker from '@/components/RankingTicker'
import { getCategories, getUserRatings, getCategoryRestaurants } from '@/lib/mock-queries'
import { MOCK_USER_ID } from '@/lib/dummy-data'
import CitySelector from '@/components/CitySelector'
import Header from '@/components/Header'
import TrackedLink from '@/components/TrackedLink'

export default async function Home() {
    const categories = await getCategories()
    const userRatings = await getUserRatings(MOCK_USER_ID)
    const hasRatings = userRatings.length > 0

    // Fetch some restaurants for the map (simulating nearby)
    const nearbyRestaurants = await getCategoryRestaurants('burgers', 'london-city-id')
    const mapLocations = nearbyRestaurants
        .filter(r => r.lat && r.lng)
        .slice(0, 5)
        .map(r => ({
            lat: r.lat!,
            lng: r.lng!,
            name: r.name,
            address: r.address || undefined
        }))

    // Fetch top 5 restaurants for each category
    const categoryRestaurants = await Promise.all(
        categories.map(async (cat) => ({
            category: cat,
            restaurants: (await getCategoryRestaurants(cat.slug, 'london-city-id')).slice(0, 5)
        }))
    )

    return (
        <div className="w-full min-h-screen relative">
            {/* Background Image */}
            <div className="fixed inset-0 -z-10">
                <Image
                    src="/Background.svg"
                    alt=""
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <Header />
            
            <div className="max-w-md mx-auto">

            {/* Mobile Logo and Welcome Section */}
                <div className="px-4 pt-6 flex flex-col items-center gap-2 md:hidden" style={{ marginBottom: '20px' }}>
                    <div className="relative w-[102px] h-[24px] mb-2">
                        <Image
                            src="/type=dishlist.svg"
                            alt="dishlist"
                            fill
                            className="object-contain"
                            priority
                            style={{
                                filter: 'brightness(0) saturate(100%) invert(24%) sepia(95%) saturate(5000%) hue-rotate(248deg) brightness(0.9) contrast(1.2)',
                                WebkitFilter: 'brightness(0) saturate(100%) invert(24%) sepia(95%) saturate(5000%) hue-rotate(248deg) brightness(0.9) contrast(1.2)'
                            }}
                        />
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <span className="text-[#180400] text-base font-medium">Welcome to</span>
                        <CitySelector />
                    </div>
                </div>

            {/* Desktop Welcome Section */}
                <div className="px-4 pt-6 hidden md:flex justify-center items-center gap-2" style={{ marginBottom: '20px' }}>
                    <span className="text-[#180400] text-base font-medium">Welcome to</span>
                    <CitySelector />
                </div>

                {/* My DishList Banner (Empty State) */}
                {!hasRatings && (
                    <div className="px-4 mb-6">
                        <Image
                            src="/mydishlistbanner.svg"
                            alt="Start rating to build your DishList"
                            width={343}
                            height={160}
                            className="w-full h-auto"
                            priority
                        />
                    </div>
                )}

                {/* Nearby Section */}
                <div className="px-4 mb-6">
                    <h3 className="text-[16px] font-bold text-[#1E1947] mb-3">Nearby</h3>
                    <div className="relative" style={{ height: '140px' }}>
                        <RestaurantMap
                            locations={mapLocations}
                            className="w-full h-full"
                            static={true}
                        />
                        <Link
                            href="/map"
                            className="absolute top-3 right-3 bg-[#3F2CD1] w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-[#3F2CD1]/90 transition active:scale-95 z-10"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3L21 3L21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 21L3 21L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

                {/* Explore Section - Break out of max-w-md container */}
                <div className="mb-6 w-full">
                    <div className="max-w-md mx-auto px-4">
                        <h3 className="text-[16px] font-bold text-[#1E1947] mb-3">Explore</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                        {categoryRestaurants.map(({ category: cat, restaurants }) => {
                            // Map category names to file names - keeping & for Fish & Chips
                            const categoryFileNameMap: Record<string, string> = {
                                'Burgers': 'Burgers',
                                'Pizza': 'Pizza',
                                'Fried Chicken': 'Fried Chicken',
                                'Kebabs': 'Kebab',
                                'Curry': 'Curry',
                                'Fish & Chips': 'Fish & Chips',
                                'Guinness': 'Guinness'
                            }

                            const categoryFileName = categoryFileNameMap[cat.name] || cat.name
                            const backgroundImage = `/category-backgrounds/Property 1=${categoryFileName}.svg`
                            const logoImage = `/food-logos/Property 1=${categoryFileName}.svg`

                            return (
                                <TrackedLink
                                    key={cat.id}
                                    href={`/categories/${cat.slug}`}
                                    className="flex flex-col items-start p-0 flex-shrink-0 active:scale-95 transition-transform"
                                    fromPage="/"
                                    style={{
                                        width: '280px',
                                        height: '134px',
                                        filter: 'drop-shadow(0px 4px 12px rgba(191, 191, 191, 0.15))',
                                        borderRadius: '16px',
                                    }}
                                >
                                    {/* Card Content */}
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                        {/* Background Image */}
                                        <Image
                                            src={backgroundImage}
                                            alt={cat.name}
                                            fill
                                            className="object-cover"
                                        />

                                        {/* Logo Overlay - centered in background only (excluding footer) */}
                                        <div className="absolute top-0 left-0 right-0 flex items-center justify-center p-4" style={{ height: 'calc(100% - 32px)' }}>
                                            <Image
                                                src={logoImage}
                                                alt={cat.name}
                                                width={120}
                                                height={120}
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* Animated Ranking Ticker */}
                                        <div className="absolute bottom-0 left-0 right-0">
                                            <RankingTicker restaurants={restaurants} />
                                        </div>
                                    </div>
                                </TrackedLink>
                            )
                        })}
                    </div>
                </div>

            <div className="max-w-md mx-auto">
                {/* Tables Section */}
                <div className="px-4 mb-6">
                    <h3 className="text-[16px] font-bold text-[#1E1947] mb-3">Tables</h3>

                    {/* DishList 100 Card */}
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        {/* Header */}
                        <div className="bg-[#2D2654] px-4 py-3 flex items-center justify-between">
                            <Image
                                src="/dishlist100.svg"
                                alt="DishList 100"
                                width={60}
                                height={16}
                                className="h-4 w-auto"
                            />
                            <Link
                                href="/dishlist-100"
                                className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition active:scale-95"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 3L21 3L21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 21L3 21L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>

                        {/* Top 3 Restaurants */}
                        <div className="bg-white">
                            {categoryRestaurants[0]?.restaurants.slice(0, 3).map((restaurant, index) => (
                                <Link
                                    key={restaurant.id}
                                    href={`/dishlist-100`}
                                    className="flex items-center gap-2 px-4 py-2.5 transition hover:opacity-80"
                                    style={{
                                        background: index % 2 === 0 ? '#FFFFFF' : '#F6F2F1',
                                        height: '56px'
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

                                    {/* Right Side - Rating & Trend */}
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
                                        <Image
                                            src="/rating-indicators /trend=up.svg"
                                            alt="trending up"
                                            width={16}
                                            height={16}
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
