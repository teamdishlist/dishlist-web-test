'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RestaurantWithDetails } from '@/lib/mock-queries'

interface RestaurantSheetProps {
    restaurant: RestaurantWithDetails | null
    isOpen: boolean
    onClose: () => void
}

const getCategoryEmoji = (categorySlug?: string): string => {
    const emojiMap: Record<string, string> = {
        'burgers': '🍔',
        'pizza': '🍕',
        'fried-chicken': '🍗',
        'kebabs': '🥙',
        'curry': '🍛',
        'fish-and-chips': '🐟',
        'guinness': '🍺'
    }
    return emojiMap[categorySlug || ''] || '🍽️'
}

const getTrend = (): 'up' | 'down' | 'same' => {
    // Simulate trend - in real app this would come from data
    const trends: ('up' | 'down' | 'same')[] = ['up', 'down', 'same']
    return trends[Math.floor(Math.random() * trends.length)]
}

export default function RestaurantSheet({ restaurant, isOpen, onClose }: RestaurantSheetProps) {
    const [isAnimating, setIsAnimating] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        if (isOpen && restaurant) {
            setShouldRender(true)
            // Trigger animation after a tiny delay to ensure DOM is ready
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true)
                })
            })
            document.body.style.overflow = 'hidden'
        } else if (!isOpen && shouldRender) {
            // Start close animation
            setIsAnimating(false)
            // Wait for animation to complete before removing from DOM
            const timer = setTimeout(() => {
                setShouldRender(false)
                document.body.style.overflow = 'unset'
            }, 650) // Match animation duration
            return () => clearTimeout(timer)
        }
        return () => {
            if (!isOpen) {
                document.body.style.overflow = 'unset'
            }
        }
    }, [isOpen, restaurant, shouldRender])

    if (!restaurant || !shouldRender) return null

    const category = restaurant.categories?.[0]
    const categorySlug = category?.slug
    const emoji = getCategoryEmoji(categorySlug)
    const trend = getTrend()
    const priceLevel = '£££' // In real app, this would come from restaurant data

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40 md:hidden"
                onClick={onClose}
                style={{
                    opacity: isAnimating ? 1 : 0,
                    pointerEvents: isAnimating ? 'auto' : 'none',
                    transition: 'opacity 0.65s cubic-bezier(0.32, 0.72, 0, 1)'
                }}
            />

            {/* Sheet */}
            <div
                className="fixed top-0 left-0 right-0 bg-white rounded-b-3xl shadow-2xl z-50 md:hidden overflow-y-auto"
                style={{
                    transform: isAnimating ? 'translateY(0)' : 'translateY(-100%)',
                    transition: 'transform 0.65s cubic-bezier(0.32, 0.72, 0, 1)',
                    maxHeight: '80vh',
                    willChange: 'transform'
                }}
            >
                <div className="px-4 pt-6 pb-8">
                    {/* Category Tag */}
                    {category && (
                        <div className="mb-3">
                            <span
                                className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold uppercase"
                                style={{ background: '#E63946' }}
                            >
                                {category.name.toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Restaurant Name */}
                    <h2 className="text-2xl font-black text-[#180400] mb-3">
                        {restaurant.name}
                    </h2>

                    {/* Location & Price */}
                    <div className="flex items-center gap-1.5 mb-4 text-gray-600 text-sm">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 0C3.243 0 1 2.243 1 5C1 8.5 6 12 6 12C6 12 11 8.5 11 5C11 2.243 8.757 0 6 0ZM6 6.5C5.17157 6.5 4.5 5.82843 4.5 5C4.5 4.17157 5.17157 3.5 6 3.5C6.82843 3.5 7.5 4.17157 7.5 5C7.5 5.82843 6.82843 6.5 6 6.5Z" fill="#E63946"/>
                        </svg>
                        <span>{restaurant.address || restaurant.neighbourhood || 'Location'}</span>
                        <span>•</span>
                        <span>{priceLevel}</span>
                    </div>

                    {/* Rating & Trend */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="flex items-center justify-center rounded-full text-[#180400] font-bold"
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    background: '#FFFFFF',
                                    border: '2px solid #E5E5E5',
                                    fontSize: '24px',
                                    lineHeight: '28px'
                                }}
                            >
                                {restaurant.avg_rating.toFixed(1)}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Image
                                    src={`/rating-indicators /trend=${trend}.svg`}
                                    alt={trend}
                                    width={16}
                                    height={16}
                                    unoptimized
                                />
                            </div>
                        </div>
                        <button
                            className="flex items-center justify-center rounded-full"
                            style={{
                                width: '32px',
                                height: '32px',
                                background: '#3F2CD1'
                            }}
                        >
                            <span className="text-white text-sm font-bold">?</span>
                        </button>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mb-6">
                        <div
                            className="px-3 py-1.5 rounded-full text-sm font-medium"
                            style={{ background: '#F5F5F5', color: '#180400' }}
                        >
                            #{Math.floor(Math.random() * 100)} dishlist
                        </div>
                        {category && (
                            <div
                                className="px-3 py-1.5 rounded-full text-sm font-medium"
                                style={{ background: '#F5F5F5', color: '#180400' }}
                            >
                                #{Math.floor(Math.random() * 50)} {category.name.toLowerCase()}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-0 border-t border-gray-200 pt-4">
                        <button className="flex-1 flex flex-col items-center gap-1 py-3 border-r border-gray-200">
                            {/* Globe icon for Book */}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM9 18.93C5.05 18.44 2 14.73 2 10C2 9.27 2.15 8.58 2.41 7.94L7 12.5V18.93ZM16.9 16.9C16.35 15.58 15.5 14.41 14.5 13.5L12.5 11.5V8.5H15.5C15.5 9.5 16.5 10.5 16.5 11.5C16.5 13.5 15.5 15.5 16.9 16.9ZM10 2C11.1 2 12.1 2.2 13 2.55L11 4.55C10.5 4.2 9.75 4 9 4C7.9 4 7 4.9 7 6V7H5C4.45 7 4 7.45 4 8V10H2C2 5.27 5.27 2 10 2Z" fill="#180400"/>
                            </svg>
                            <span className="text-xs font-medium text-[#180400]">Book</span>
                        </button>
                        <button className="flex-1 flex flex-col items-center gap-1 py-3 border-r border-gray-200">
                            {/* Shopping bag icon for Order */}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 18C7.83 18 8.5 17.33 8.5 16.5C8.5 15.67 7.83 15 7 15C6.17 15 5.5 15.67 5.5 16.5C5.5 17.33 6.17 18 7 18ZM17 18C17.83 18 18.5 17.33 18.5 16.5C18.5 15.67 17.83 15 17 15C16.17 15 15.5 15.67 15.5 16.5C15.5 17.33 16.17 18 17 18ZM17.08 11H5.21L4.27 4H1V2H3.74L4.76 9.5H16.92L18.5 4H20.5L17.08 11Z" fill="#180400"/>
                            </svg>
                            <span className="text-xs font-medium text-[#180400]">Order</span>
                        </button>
                        <Link
                            href={`/restaurants/${restaurant.id}`}
                            className="flex-1 flex flex-col items-center gap-1 py-3"
                        >
                            {/* Arrow icon for Go */}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 3L17 10L11 17M17 10H3" stroke="#180400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-xs font-medium text-[#180400]">Go</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

