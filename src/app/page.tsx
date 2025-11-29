import Link from 'next/link'
import Image from 'next/image'
import RestaurantMap from '@/components/RestaurantMap'
import RankingTicker from '@/components/RankingTicker'
import { getCategories, getUserRatings, getCategoryRestaurants } from '@/lib/mock-queries'
import { MOCK_USER_ID } from '@/lib/dummy-data'
import CitySelector from '@/components/CitySelector'

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
        <div className="max-w-md mx-auto px-4 pt-6 min-h-screen relative">
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

            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-[#180400] text-base font-medium">Welcome to</span>
                    <CitySelector />
                </div>
                <Link href="/profile" className="bg-[#3F2CD1] w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </header>

            {/* My DishList Banner (Empty State) */}
            {!hasRatings && (
                <div className="mb-8">
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
            <div className="mb-8">
                <h3 className="text-[16px] font-bold text-[#1E1947] mb-3">Nearby</h3>
                <div className="relative">
                    <RestaurantMap
                        locations={mapLocations}
                        className="h-40 w-full"
                    />
                    <Link
                        href="/explore"
                        className="absolute top-3 right-3 bg-[#3F2CD1] w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-[#3F2CD1]/90 transition active:scale-95 z-10"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3L21 3L21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 21L3 21L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>


            {/* Explore Section */}
            <div className="mb-8">
                <h3 className="text-[16px] font-bold text-[#1E1947] mb-3">Explore</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
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
                            <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className="flex flex-col items-start p-0 flex-shrink-0 active:scale-95 transition-transform"
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
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Tables Section */}
            <div className="mb-8">
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
                                className={`flex items-center gap-2 px-4 py-3 transition active:scale-[0.99] ${index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-[#F6F2F1] hover:bg-[#F6F2F1]/80'
                                    }`}
                            >
                                {/* Rank */}
                                <span className="text-base font-bold text-gray-900 w-8">{index + 1}</span>

                                {/* Food Emoji */}
                                <span className="text-3xl">
                                    {index === 0 && '🍕'}
                                    {index === 1 && '🍔'}
                                    {index === 2 && '🍛'}
                                </span>

                                {/* Restaurant Info */}
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-base">{restaurant.name}</h4>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444" />
                                            <circle cx="12" cy="9" r="2.5" fill="white" />
                                        </svg>
                                        <span>Multiple locations</span>
                                    </div>
                                </div>

                                {/* Rating with Trend */}
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-bold text-gray-900">{restaurant.avg_rating.toFixed(1)}</span>
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
    )
}
