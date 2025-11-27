import { Database } from '@/types/database.types'
import {
    CITIES,
    CATEGORIES,
    RESTAURANTS,
    RESTAURANT_CATEGORIES,
    RATINGS,
    MY_LIST_ENTRIES,
    RESTAURANT_LOCATIONS,
    MOCK_USER_ID
} from './dummy-data'

type Tables = Database['public']['Tables']
type Category = Tables['categories']['Row']
type Restaurant = Tables['restaurants']['Row']
type Rating = Tables['ratings']['Row']
type MyListEntry = Tables['my_list_entries']['Row']

// Restaurant with category and rating info
export type RestaurantWithDetails = Restaurant & {
    categories: Category[]
    avg_rating: number
    rating_count: number
    user_rating?: Rating
    locations?: Tables['restaurant_locations']['Row'][]
    ratings?: Rating[]
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10))
    return CATEGORIES.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Fetch restaurants for a specific category, ranked by average rating
 */
export async function getCategoryRestaurants(
    categorySlug: string,
    cityId: string
): Promise<RestaurantWithDetails[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10))

    // Find category
    const category = CATEGORIES.find(c => c.slug === categorySlug)
    if (!category) return []

    // Get restaurant IDs for this category
    const restaurantIds = RESTAURANT_CATEGORIES
        .filter(rc => rc.category_id === category.id)
        .map(rc => rc.restaurant_id)

    // Get restaurants in this city and category
    const restaurants = RESTAURANTS.filter(
        r => r.city_id === cityId && restaurantIds.includes(r.id)
    )

    // Calculate ratings and format data
    const restaurantsWithDetails: RestaurantWithDetails[] = restaurants.map(restaurant => {
        const restaurantRatings = RATINGS.filter(r => r.restaurant_id === restaurant.id)
        const avg_rating = restaurantRatings.length > 0
            ? restaurantRatings.reduce((sum, rating) => sum + rating.score, 0) / restaurantRatings.length
            : 0

        return {
            ...restaurant,
            categories: [category],
            avg_rating,
            rating_count: restaurantRatings.length
        }
    })

    // Sort by average rating (highest first)
    return restaurantsWithDetails.sort((a, b) => b.avg_rating - a.avg_rating)
}

/**
 * Fetch a single restaurant with full details
 */
export async function getRestaurant(
    restaurantId: string,
    userId?: string
): Promise<RestaurantWithDetails | null> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10))

    const restaurant = RESTAURANTS.find(r => r.id === restaurantId)
    if (!restaurant) return null

    // Get categories for this restaurant
    const categoryIds = RESTAURANT_CATEGORIES
        .filter(rc => rc.restaurant_id === restaurantId)
        .map(rc => rc.category_id)

    const categories = CATEGORIES.filter(c => categoryIds.includes(c.id))

    // Get ratings
    const ratings = RATINGS.filter(r => r.restaurant_id === restaurantId)
        .sort((a, b) => b.score - a.score) // Sort high to low

    // Calculate average rating
    const avg_rating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length
        : 0

    // Get user's rating if logged in
    let userRating = undefined
    if (userId) {
        userRating = RATINGS.find(
            r => r.restaurant_id === restaurantId && r.user_id === userId
        )
    }

    // Get locations
    const locations = RESTAURANT_LOCATIONS.filter(l => l.restaurant_id === restaurantId)

    return {
        ...restaurant,
        categories,
        avg_rating,
        rating_count: ratings.length,
        user_rating: userRating,
        locations,
        ratings
    }
}

/**
 * Fetch user's My List
 */
export async function getMyList(userId: string): Promise<(MyListEntry & { restaurant: Restaurant })[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10))

    const entries = MY_LIST_ENTRIES
        .filter(entry => entry.user_id === userId)
        .map(entry => {
            const restaurant = RESTAURANTS.find(r => r.id === entry.restaurant_id)
            return {
                ...entry,
                restaurant: restaurant!
            }
        })
        .filter(entry => entry.restaurant) // Filter out any entries with missing restaurants
        .sort((a, b) => (a.position || 0) - (b.position || 0))

    return entries
}

/**
 * Fetch user's ratings
 */
export async function getUserRatings(userId: string): Promise<(Rating & { restaurant: Restaurant })[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10))

    const ratings = RATINGS
        .filter(rating => rating.user_id === userId)
        .map(rating => {
            const restaurant = RESTAURANTS.find(r => r.id === rating.restaurant_id)
            return {
                ...rating,
                restaurant: restaurant!
            }
        })
        .filter(rating => rating.restaurant) // Filter out any ratings with missing restaurants
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return ratings
}

/**
 * Get city by slug
 */
export async function getCityBySlug(slug: string) {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10))

    const city = CITIES.find(c => c.slug === slug)
    return city || null
}
