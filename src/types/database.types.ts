export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            cities: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    country: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    country: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    country?: string
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    is_special: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    is_special?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    is_special?: boolean
                    created_at?: string
                }
            }
            restaurants: {
                Row: {
                    id: string
                    name: string
                    city_id: string
                    neighbourhood: string | null
                    address: string | null
                    lat: number | null
                    lng: number | null
                    google_place_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    city_id: string
                    neighbourhood?: string | null
                    address?: string | null
                    lat?: number | null
                    lng?: number | null
                    google_place_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    city_id?: string
                    neighbourhood?: string | null
                    address?: string | null
                    lat?: number | null
                    lng?: number | null
                    google_place_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            restaurant_categories: {
                Row: {
                    restaurant_id: string
                    category_id: string
                }
                Insert: {
                    restaurant_id: string
                    category_id: string
                }
                Update: {
                    restaurant_id?: string
                    category_id?: string
                }
            }
            ratings: {
                Row: {
                    id: string
                    user_id: string
                    restaurant_id: string
                    score: number
                    review_text: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    restaurant_id: string
                    score: number
                    review_text?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    restaurant_id?: string
                    score?: number
                    review_text?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            my_list_entries: {
                Row: {
                    id: string
                    user_id: string
                    restaurant_id: string
                    position: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    restaurant_id: string
                    position?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    restaurant_id?: string
                    position?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            voice_notes: {
                Row: {
                    id: string
                    rating_id: string
                    user_id: string
                    file_url: string
                    duration_seconds: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    rating_id: string
                    user_id: string
                    file_url: string
                    duration_seconds?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    rating_id?: string
                    user_id?: string
                    file_url?: string
                    duration_seconds?: number | null
                    created_at?: string
                }
            }
        }
    }
}
