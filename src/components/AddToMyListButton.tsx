'use client'

import { useState } from 'react'

export default function AddToMyListButton({ restaurantId }: { restaurantId: string }) {
    const [isAdded, setIsAdded] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        // TODO: Implement actual API call to Supabase
        await new Promise(resolve => setTimeout(resolve, 500)) // Fake delay
        setIsAdded(!isAdded)
        setLoading(false)
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`
        w-full py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2
        ${isAdded
                    ? 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                }
      `}
        >
            {loading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isAdded ? (
                <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to List
                </>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add to My List
                </>
            )}
        </button>
    )
}
