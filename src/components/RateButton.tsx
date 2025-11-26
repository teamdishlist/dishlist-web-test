'use client'

export default function RateButton({ restaurantId }: { restaurantId: string }) {
    return (
        <button
            className="w-full bg-white border-2 border-gray-100 text-gray-900 py-3 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
            onClick={() => alert('Rating feature coming soon!')}
        >
            Rate & Review
        </button>
    )
}
