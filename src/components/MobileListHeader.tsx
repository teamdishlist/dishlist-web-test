'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface MobileListHeaderProps {
    title: string
    backgroundImage?: string
    logoImage?: string
    showBackButton?: boolean
    logoSize?: { width: number; height: number }
}

export default function MobileListHeader({ title, backgroundImage, logoImage, showBackButton, logoSize }: MobileListHeaderProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [shouldShowBack, setShouldShowBack] = useState(false)

    useEffect(() => {
        // Check if we should show back button
        // Show back if explicitly set, or if we can detect navigation from homepage/explore
        if (showBackButton !== undefined) {
            setShouldShowBack(showBackButton)
        } else {
            // Check sessionStorage to see if we came from homepage or explore
            const fromPage = sessionStorage.getItem('fromPage')
            setShouldShowBack(fromPage === '/' || fromPage === '/explore')
        }
    }, [showBackButton])

    const handleBack = () => {
        router.back()
    }

    return (
        <header 
            className="w-full shadow-lg relative z-50 md:hidden overflow-hidden"
            style={{ 
                minHeight: 'auto',
                background: backgroundImage ? 'transparent' : '#1E1947',
                marginBottom: '0'
            }}
        >
            {/* Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}
            
            <div className="flex items-center justify-center px-4 relative z-10" style={{ paddingTop: '32px', paddingBottom: '12px', minHeight: '80px' }}>
                {/* Back Button */}
                {shouldShowBack && (
                    <button
                        onClick={handleBack}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
                        aria-label="Go back"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
                
                {/* Logo or Title - Centered and aligned with back button */}
                {logoImage ? (
                    <div className="flex items-center justify-center w-full">
                        <Image
                            src={logoImage}
                            alt={title}
                            width={logoSize?.width || 120}
                            height={logoSize?.height || 40}
                            priority
                            className="object-contain"
                        />
                    </div>
                ) : (
                    <h1 
                        className="text-white text-center"
                        style={{
                            fontFamily: 'Sofia Sans, sans-serif',
                            fontSize: '24px',
                            fontWeight: 700,
                            lineHeight: '1.2'
                        }}
                    >
                        {title}
                    </h1>
                )}
            </div>
        </header>
    )
}

