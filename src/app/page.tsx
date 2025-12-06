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
                        <svg width="102" height="24" viewBox="0 0 237 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                            <path d="M17.3898 56C13.7554 56 10.6271 55.1484 8.00484 53.4451C5.42857 51.6958 3.45036 49.2791 2.07022 46.1948C0.690073 43.1106 0 39.589 0 35.6301C0 31.6252 0.690073 28.0806 2.07022 24.9963C3.45036 21.912 5.42857 19.4953 8.00484 17.746C10.6271 15.9967 13.7554 15.1221 17.3898 15.1221C19.9661 15.1221 22.1513 15.5824 23.9455 16.5031C25.7857 17.4238 27.2809 18.7587 28.431 20.508V50.6831C27.3269 52.3403 25.8777 53.6523 24.0835 54.619C22.3353 55.5397 20.1041 56 17.3898 56ZM19.115 47.1615C21.2312 47.1615 22.9794 46.6552 24.3596 45.6424C25.7397 44.5836 26.7518 43.1796 27.3959 41.4303C28.086 39.6811 28.431 37.7476 28.431 35.6301C28.431 33.4665 28.086 31.5101 27.3959 29.7608C26.7518 27.9655 25.7397 26.5614 24.3596 25.5487C22.9794 24.4899 21.2312 23.9605 19.115 23.9605C17.1368 23.9605 15.4576 24.4899 14.0775 25.5487C12.7433 26.5614 11.7312 27.9655 11.0412 29.7608C10.3971 31.5101 10.0751 33.4665 10.0751 35.6301C10.0751 37.7476 10.3971 39.6811 11.0412 41.4303C11.7312 43.1796 12.7433 44.5836 14.0775 45.6424C15.4576 46.6552 17.1368 47.1615 19.115 47.1615ZM28.431 54.8952V3.10727H38.299V54.8952H28.431Z" fill="#3F2CD1"/>
                            <path d="M47.6792 16.2269H57.5472V54.8952H47.6792V16.2269ZM44.9189 2.41677L55.477 0L57.8922 10.5647L47.3341 12.9815L44.9189 2.41677Z" fill="#3F2CD1"/>
                            <path d="M73.0814 42.6732C73.3114 44.5146 74.1165 45.8035 75.4966 46.5401C76.8768 47.2306 78.4639 47.5758 80.2581 47.5758C82.0063 47.5758 83.4555 47.2766 84.6056 46.6782C85.7557 46.0337 86.3308 44.9979 86.3308 43.5709C86.3308 42.6502 85.9167 41.9597 85.0886 41.4994C84.2605 40.993 83.1794 40.6017 81.8453 40.3255C80.5112 40.0033 79.039 39.7041 77.4288 39.4279C75.8187 39.1517 74.1855 38.7834 72.5293 38.3231C70.9191 37.8627 69.447 37.2183 68.1128 36.3896C66.7787 35.561 65.6976 34.4332 64.8695 33.0062C64.0414 31.5791 63.6274 29.7608 63.6274 27.5512C63.6274 25.4797 64.2944 23.5002 65.6286 21.6128C67.0087 19.6794 68.9179 18.1143 71.3562 16.9174C73.7944 15.7205 76.5777 15.1221 79.7061 15.1221C82.5124 15.1221 85.1116 15.6975 87.5039 16.8483C89.8961 17.9531 91.8283 19.4953 93.3005 21.4747C94.7727 23.4542 95.5087 25.7559 95.5087 28.3798H85.6407C85.4567 26.5384 84.7666 25.2725 83.5705 24.582C82.4204 23.8915 81.0402 23.5462 79.43 23.5462C77.4518 23.5462 75.9567 23.9375 74.9446 24.7201C73.9325 25.4566 73.4264 26.4003 73.4264 27.5512C73.4264 28.5639 73.8405 29.3465 74.6685 29.8989C75.4966 30.4513 76.5777 30.8886 77.9119 31.2108C79.246 31.5331 80.7182 31.8323 82.3283 32.1085C83.9845 32.3387 85.6177 32.6839 87.2279 33.1443C88.838 33.5586 90.3102 34.18 91.6443 35.0086C92.9785 35.7912 94.0596 36.873 94.8877 38.254C95.7158 39.635 96.1298 41.4073 96.1298 43.5709C96.1298 46.0107 95.4397 48.1743 94.0596 50.0617C92.7254 51.903 90.8392 53.3531 88.401 54.4118C86.0087 55.4706 83.1794 56 79.9131 56C76.8768 56 74.0935 55.4246 71.5632 54.2737C69.0789 53.0769 67.0777 51.4887 65.5596 49.5092C64.0414 47.4838 63.2363 45.2051 63.1443 42.6732H73.0814Z" fill="#3F2CD1"/>
                            <path d="M101.729 3.10727H111.597V54.8952H101.729V3.10727ZM111.597 35.9753L110.492 28.0345C110.492 26.8376 110.653 25.5027 110.976 24.0296C111.344 22.5565 111.988 21.1525 112.908 19.8175C113.874 18.4365 115.231 17.3087 116.979 16.434C118.727 15.5594 121.005 15.1221 123.811 15.1221C126.295 15.1221 128.503 15.6284 130.436 16.6412C132.368 17.6539 133.886 19.3342 134.99 21.6819C136.094 23.9836 136.646 27.1138 136.646 31.0727V54.8952H126.778V31.9704C126.778 30.4513 126.663 29.0703 126.433 27.8274C126.203 26.5384 125.674 25.5257 124.846 24.7891C124.064 24.0526 122.799 23.6843 121.051 23.6843C119.67 23.6843 118.244 24.0756 116.772 24.8582C115.3 25.6408 114.058 26.9297 113.046 28.725C112.08 30.4743 111.597 32.8911 111.597 35.9753Z" fill="#3F2CD1"/>
                            <path d="M142.971 3.10727H152.839V54.8952H142.971V3.10727Z" fill="#3F2CD1"/>
                            <path d="M162.242 16.2269H172.11V54.8952H162.242V16.2269ZM159.482 2.41677L170.04 0L172.455 10.5647L161.897 12.9815L159.482 2.41677Z" fill="#3F2CD1"/>
                            <path d="M187.644 42.6732C187.874 44.5146 188.679 45.8035 190.059 46.5401C191.44 47.2306 193.027 47.5758 194.821 47.5758C196.569 47.5758 198.018 47.2766 199.168 46.6782C200.319 46.0337 200.894 44.9979 200.894 43.5709C200.894 42.6502 200.48 41.9597 199.651 41.4994C198.823 40.993 197.742 40.6017 196.408 40.3255C195.074 40.0033 193.602 39.7041 191.992 39.4279C190.381 39.1517 188.748 38.7834 187.092 38.3231C185.482 37.8627 184.01 37.2183 182.676 36.3896C181.342 35.561 180.26 34.4332 179.432 33.0062C178.604 31.5791 178.19 29.7608 178.19 27.5512C178.19 25.4797 178.857 23.5002 180.191 21.6128C181.572 19.6794 183.481 18.1143 185.919 16.9174C188.357 15.7205 191.141 15.1221 194.269 15.1221C197.075 15.1221 199.674 15.6975 202.067 16.8483C204.459 17.9531 206.391 19.4953 207.863 21.4747C209.335 23.4542 210.072 25.7559 210.072 28.3798H200.204C200.019 26.5384 199.329 25.2725 198.133 24.582C196.983 23.8915 195.603 23.5462 193.993 23.5462C192.015 23.5462 190.519 23.9375 189.507 24.7201C188.495 25.4566 187.989 26.4003 187.989 27.5512C187.989 28.5639 188.403 29.3465 189.231 29.8989C190.059 30.4513 191.141 30.8886 192.475 31.2108C193.809 31.5331 195.281 31.8323 196.891 32.1085C198.547 32.3387 200.181 32.6839 201.791 33.1443C203.401 33.5586 204.873 34.18 206.207 35.0086C207.541 35.7912 208.622 36.873 209.45 38.254C210.279 39.635 210.693 41.4073 210.693 43.5709C210.693 46.0107 210.003 48.1743 208.622 50.0617C207.288 51.903 205.402 53.3531 202.964 54.4118C200.572 55.4706 197.742 56 194.476 56C191.44 56 188.656 55.4246 186.126 54.2737C183.642 53.0769 181.641 51.4887 180.122 49.5092C178.604 47.4838 177.799 45.2051 177.707 42.6732H187.644Z" fill="#3F2CD1"/>
                            <path d="M218.575 54.8952V6.5598H228.443V46.471H237V54.8952H218.575ZM214.159 24.651V16.2269H235.896V24.651H214.159Z" fill="#3F2CD1"/>
                        </svg>
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
                {/* Lists Section */}
                <div className="px-4 mb-6">
                    <h3 className="text-[16px] font-bold text-[#1E1947] mb-3">Lists</h3>

                    {/* DishList 100 Card */}
                    <div className="rounded-2xl overflow-hidden shadow-lg mb-4">
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

                    {/* Category Cards */}
                    {categoryRestaurants.map(({ category, restaurants }) => {
                        // Map category names to file names
                        const categoryFileNameMap: Record<string, string> = {
                            'Burgers': 'Burgers',
                            'Pizza': 'Pizza',
                            'Fried Chicken': 'Fried Chicken',
                            'Kebabs': 'Kebab',
                            'Curry': 'Curry',
                            'Fish & Chips': 'Fish & Chips',
                            'Guinness': 'Guinness'
                        }

                        const categoryFileName = categoryFileNameMap[category.name] || category.name
                        const logoFileName = category.name === 'Fried Chicken' ? 'Fried Chicken (Long)' : categoryFileName
                        const logoImage = `/food-logos/Property 1=${logoFileName}.svg`
                        const backgroundImage = `/category-backgrounds/Property 1=${categoryFileName}.svg`

                        // Get category emoji
                        const categoryEmoji = category.slug === 'pizza' ? '🍕' :
                            category.slug === 'burgers' ? '🍔' :
                                category.slug === 'fried-chicken' ? '🍗' :
                                    category.slug === 'kebabs' ? '🥙' :
                                        category.slug === 'curry' ? '🍛' :
                                            category.slug === 'fish-and-chips' ? '🐟' :
                                                category.slug === 'guinness' ? '🍺' : '🍽️'

                        return (
                            <div key={category.id} className="rounded-2xl overflow-hidden shadow-lg mb-4">
                                {/* Header */}
                                <div 
                                    className="px-4 py-3 flex items-center justify-between relative"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={backgroundImage}
                                            alt={category.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10 flex items-center gap-2">
                                        <Image
                                            src={logoImage}
                                            alt={category.name}
                                            width={category.name === 'Guinness' ? 60 : 80}
                                            height={category.name === 'Guinness' ? 18 : 24}
                                            className="w-auto"
                                            style={{ height: category.name === 'Guinness' ? '18px' : '24px' }}
                                        />
                                    </div>
                                    <Link
                                        href={`/categories/${category.slug}`}
                                        className="relative z-10 bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition active:scale-95"
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
                                    {restaurants.slice(0, 3).map((restaurant, index) => (
                                        <Link
                                            key={restaurant.id}
                                            href={`/categories/${category.slug}`}
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
                                                        {categoryEmoji}
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
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
