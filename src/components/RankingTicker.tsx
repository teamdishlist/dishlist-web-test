'use client'

import Image from 'next/image'

interface Restaurant {
    id: string
    name: string
    avg_rating: number
}

interface RankingTickerProps {
    restaurants: Restaurant[]
}

export default function RankingTicker({ restaurants }: RankingTickerProps) {
    if (restaurants.length === 0) {
        return (
            <div className="bg-white px-3 py-2">
                <p className="text-xs text-[#3D0900] font-regular">
                    No restaurants available
                </p>
            </div>
        )
    }

    // Simulate trend - in real app this would come from historical data
    const getTrendIndicator = (index: number) => {
        const trends = ['up', 'same', 'down', 'up', 'same']
        return trends[index % trends.length]
    }

    // Create the ticker content
    const tickerContent = restaurants.map((restaurant, index) => {
        const trend = getTrendIndicator(index)
        const trendIcon = `/rating-indicators /trend=${trend}.svg`

        return (
            <span key={restaurant.id} className="inline-flex items-center gap-1.5 whitespace-nowrap mr-4">
                <span className="font-regular">{index + 1}</span>
                <span className="font-regular">{restaurant.name}</span>
                <span className="font-bold">{restaurant.avg_rating.toFixed(1)}</span>
                <Image
                    src={trendIcon}
                    alt={trend}
                    width={12}
                    height={12}
                    className="inline-block"
                />
            </span>
        )
    })

    return (
        <div className="bg-white py-2 overflow-hidden relative">
            <div className="ticker-wrapper">
                <div className="ticker-content text-[14px] text-[#3D0900]">
                    {tickerContent}
                    {/* Duplicate for seamless loop */}
                    {tickerContent}
                </div>
            </div>
        </div>
    )
}
