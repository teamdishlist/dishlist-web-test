'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

export default function BottomNav() {
    const pathname = usePathname()
    const router = useRouter()

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true
        if (path !== '/' && pathname?.startsWith(path)) return true
        return false
    }

    const navItems = [
        {
            href: '/',
            label: 'Explore',
            icon: '/bottom-nav/explore.svg',
            active: isActive('/')
        },
        {
            href: '/map',
            label: 'Map',
            icon: '/bottom-nav/map.svg',
            active: isActive('/map')
        },
        {
            href: '/dishlist-100',
            label: '100',
            icon: '/bottom-nav/trending-up.svg',
            active: isActive('/dishlist-100')
        },
        {
            href: '/explore',
            label: 'Lists',
            icon: '/bottom-nav/list.svg',
            active: isActive('/explore')
        },
        {
            href: '/my-list',
            label: 'You',
            icon: '/bottom-nav/You.svg',
            active: isActive('/my-list')
        }
    ]

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 bg-white md:hidden"
            style={{
                boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.15)',
                height: '72px',
                zIndex: 50,
                width: '100%',
                maxWidth: '100vw',
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}
        >
            <div 
                className="flex flex-row items-end h-full relative"
                style={{
                    padding: '16px 28px',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                }}
            >
                {navItems.map((item, index) => {
                    const isItemActive = item.active
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center flex-shrink-0"
                            style={{
                                gap: '4px',
                                width: '48px',
                                height: '38px',
                                position: 'relative',
                                zIndex: index
                            }}
                            onClick={() => {
                                // Clear fromPage when navigating from bottom nav
                                sessionStorage.removeItem('fromPage')
                            }}
                        >
                            {/* Active indicator bar */}
                            {isItemActive && (
                                <div
                                    className="absolute"
                                    style={{
                                        width: '44px',
                                        height: '4px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        top: '-17px',
                                        background: '#3F2CD1',
                                        borderRadius: '0px 0px 16px 16px',
                                        zIndex: 10
                                    }}
                                />
                            )}
                            
                            {/* Icon */}
                            <div
                                className="flex items-center justify-center relative"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    marginTop: isItemActive ? '4px' : '0'
                                }}
                            >
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        position: 'relative'
                                    }}
                                >
                                    {isItemActive && item.href === '/' ? (
                                        // Explore icon is already purple when active
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            width={20}
                                            height={20}
                                        />
                                    ) : (
                                        // For other icons, apply color filter to make them purple when active, dark when inactive
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            width={20}
                                            height={20}
                                            className={isItemActive ? 'bottom-nav-icon-active' : 'bottom-nav-icon-inactive'}
                                        />
                                    )}
                                </div>
                            </div>
                            
                            {/* Label */}
                            <span
                                className="text-center"
                                style={{
                                    fontFamily: 'Sofia Sans, sans-serif',
                                    fontStyle: 'normal',
                                    fontWeight: isItemActive ? 700 : 400,
                                    fontSize: '12px',
                                    lineHeight: '14px',
                                    color: isItemActive ? '#3F2CD1' : '#290600',
                                    width: '48px',
                                    height: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

