import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'

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

// ... (keep getCategories and getCategoryRestaurants as is)

/**
 * Fetch a single restaurant with full details
 */
export async function getRestaurant(
    restaurantId: string,
    userId?: string
): Promise<RestaurantWithDetails | null> {
    const supabase = await createClient()

    const { data: restaurant, error } = await supabase
        .from('restaurants')
        .select(`
      *,
      restaurant_categories(
        categories(*)
      ),
      ratings(*),
      restaurant_locations(*)
    `)
        .eq('id', restaurantId)
        .single()

    if (error || !restaurant) return null

    // Get user's rating if logged in
    let userRating = undefined
    if (userId) {
        const { data } = await supabase
            .from('ratings')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .eq('user_id', userId)
            .single()

        userRating = data || undefined
    }

    const ratings = restaurant.ratings || []
    const avg_rating = ratings.length > 0
        ? ratings.reduce((sum: number, rating: any) => sum + rating.score, 0) / ratings.length
        : 0

    return {
        ...restaurant,
        categories: restaurant.restaurant_categories?.map((rc: any) => rc.categories) || [],
        avg_rating,
        rating_count: ratings.length,
        user_rating: userRating,
        locations: restaurant.restaurant_locations || [],
        ratings: ratings.sort((a: any, b: any) => b.score - a.score) // Sort ratings high to low
    }
}

/**
 * Fetch user's My List
 */
export async function getMyList(userId: string): Promise<(MyListEntry & { restaurant: Restaurant })[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('my_list_entries')
        .select(`
      *,
      restaurants(*)
    `)
        .eq('user_id', userId)
        .order('position', { ascending: true })

    if (error) throw error
    return (data || []).map((entry: any) => ({
        ...entry,
        restaurant: entry.restaurants,
    }))
}

/**
 * Fetch user's ratings
 */
export async function getUserRatings(userId: string): Promise<(Rating & { restaurant: Restaurant })[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('ratings')
        .select(`
      *,
      restaurants(*)
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map((rating: any) => ({
        ...rating,
        restaurant: rating.restaurants,
    }))
}
