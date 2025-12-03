import RestaurantMap from '@/components/RestaurantMap'
import { getCategoryRestaurants } from '@/lib/mock-queries'
import Header from '@/components/Header'

export default async function MapPage() {
    // Fetch restaurants for the map
    const nearbyRestaurants = await getCategoryRestaurants('burgers', 'london-city-id')
    const mapLocations = nearbyRestaurants
        .filter(r => r.lat && r.lng)
        .map(r => ({
            lat: r.lat!,
            lng: r.lng!,
            name: r.name,
            address: r.address || undefined
        }))

    return (
        <div className="max-w-md mx-auto min-h-screen relative bg-[#F6F2F1]">
            <Header />
            <div className="h-[calc(100vh-142px)] w-full relative">
                <RestaurantMap
                    locations={mapLocations}
                    className="w-full h-full rounded-none"
                />
            </div>
        </div>
    )
}
