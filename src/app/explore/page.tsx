'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCity } from '@/contexts/CityContext'
import { getCategories } from '@/lib/mock-queries'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import TrackedLink from '@/components/TrackedLink'

export default function ExplorePage() {
    const { currentCity } = useCity()
    const [categories, setCategories] = useState<any[]>([])
    const pathname = usePathname()

    useEffect(() => {
        async function fetchCategories() {
            const cats = await getCategories()
            setCategories(cats)
        }
        fetchCategories()
    }, [])

    // Track navigation for back button detection
    useEffect(() => {
        // Store current page in sessionStorage when navigating from homepage or explore
        const currentPath = window.location.pathname
        if (currentPath === '/' || currentPath === '/explore') {
            sessionStorage.setItem('fromPage', currentPath)
        }
    }, [pathname])

    // Map category names to file names for backgrounds
    const categoryBackgroundMap: Record<string, string> = {
        'Burgers': 'Burgers',
        'Pizza': 'Pizza',
        'Fried Chicken': 'Fried Chicken',
        'Kebabs': 'Kebab',
        'Curry': 'Curry',
        'Fish & Chips': 'Fish & Chips',
        'Guinness': 'Guinness'
    }

    // Map category names to file names for logos
    const categoryLogoMap: Record<string, string> = {
        'Burgers': 'Burgers',
        'Pizza': 'Pizza',
        'Fried Chicken': 'Fried Chicken',
        'Kebabs': 'Kebab',
        'Curry': 'Curry',
        'Fish & Chips': 'Fish & Chips (Stack)',
        'Guinness': 'Guinness'
    }

    // Logo sizes for specific categories
    const logoSizeMap: Record<string, { width: number; height: number }> = {
        'Burgers': { width: 140, height: 140 },
        'Guinness': { width: 140, height: 140 },
        'Curry': { width: 120, height: 120 },
        'Fried Chicken': { width: 120, height: 120 },
        'Kebabs': { width: 120, height: 120 },
        'Pizza': { width: 120, height: 120 },
        'default': { width: 100, height: 100 }
    }

    // Special cards for dishlist 100 and My dishlist
    const specialCards = [
        {
            id: 'dishlist-100',
            name: 'dishlist',
            subtext: '100',
            href: '/dishlist-100',
            background: '#1E1947', // Dark purple
            textColor: '#FFFFFF',
            logoImage: '/food-logos/Property 1=Dishlist 100.svg'
        },
        {
            id: 'my-dishlist',
            name: 'My dishlist',
            href: '/my-list',
            background: '#3F2CD1', // Brand purple
            textColor: '#FFFFFF',
            logoImage: '/food-logos/Property 1=My Dishlist.svg'
        }
    ]

    // Category cards
    const categoryCards = categories.map(cat => {
        const backgroundFileName = categoryBackgroundMap[cat.name] || cat.name
        const logoFileName = categoryLogoMap[cat.name] || cat.name
        const backgroundImage = `/category-backgrounds/Property 1=${backgroundFileName}.svg`
        const logoImage = `/food-logos/Property 1=${logoFileName}.svg`

        return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            href: `/categories/${cat.slug}`,
            backgroundImage,
            logoImage
        }
    })

    // Combine all cards
    const allCards = [...specialCards, ...categoryCards]

    return (
        <div className="w-full min-h-screen" style={{ background: '#F6F2F1' }}>
            <div className="max-w-md mx-auto px-4 pt-6 pb-20">
                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 
                        className="mb-1"
                        style={{
                            fontFamily: '"Stack Sans Notch", sans-serif',
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#290600',
                            lineHeight: '1.2'
                        }}
                    >
                        Lists
                    </h1>
                    <p 
                        className="text-gray-500"
                        style={{
                            fontFamily: 'Sofia Sans, sans-serif',
                            fontSize: '14px',
                            color: '#6B7280'
                        }}
                    >
                        The best food around
                    </p>
                </header>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {allCards.map((card, index) => {
                        if (card.id === 'dishlist-100' || card.id === 'my-dishlist') {
                            // Special cards with logos
                            const specialCard = card as { id: string; name: string; href: string; background: string; textColor: string; logoImage: string; subtext?: string }
                            return (
                                <TrackedLink
                                    key={specialCard.id}
                                    href={specialCard.href}
                                    className="rounded-2xl p-6 flex flex-col justify-center items-center active:scale-95 transition-transform relative"
                                    style={{
                                        background: specialCard.background,
                                        minHeight: '120px',
                                        filter: 'drop-shadow(0px 4px 12px rgba(191, 191, 191, 0.15))'
                                    }}
                                    fromPage="/explore"
                                >
                                    {specialCard.logoImage && (
                                        <div className="mb-2">
                                            <Image
                                                src={specialCard.logoImage}
                                                alt={specialCard.name}
                                                width={120}
                                                height={120}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                </TrackedLink>
                            )
                        } else {
                            // Category cards with background images
                            const categoryCard = card as { id: string; name: string; slug: string; href: string; backgroundImage: string; logoImage: string }
                            const logoSize = logoSizeMap[categoryCard.name] || logoSizeMap['default']
                            return (
                                <TrackedLink
                                    key={categoryCard.id}
                                    href={categoryCard.href}
                                    className="rounded-2xl overflow-hidden active:scale-95 transition-transform relative"
                                    style={{
                                        minHeight: '120px',
                                        filter: 'drop-shadow(0px 4px 12px rgba(191, 191, 191, 0.15))'
                                    }}
                                    fromPage="/explore"
                                >
                                    <div className="relative w-full h-full">
                                        {/* Background Image */}
                                        <Image
                                            src={categoryCard.backgroundImage}
                                            alt={categoryCard.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Logo Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                            <Image
                                                src={categoryCard.logoImage}
                                                alt={categoryCard.name}
                                                width={logoSize.width}
                                                height={logoSize.height}
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                </TrackedLink>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
