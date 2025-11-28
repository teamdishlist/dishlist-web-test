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
                        className="absolute top-3 right-3 bg-[#3F2CD1] w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md active:scale-95 transition-transform z-10"
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
        </div>
    )
}
