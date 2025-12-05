'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import CitySelector from './CitySelector'

export default function Header() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true
        if (path !== '/' && pathname?.startsWith(path)) return true
        return false
    }

    return (
        <header className="bg-[#1E1947] w-full shadow-lg relative z-50 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Layout */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="relative w-[102px] h-[24px] flex-shrink-0">
                        <Image
                            src="/type=dishlist.svg"
                            alt="dishlist"
                            fill
                            className="object-contain"
                            priority
                        />
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-8 flex-1 justify-center">
                        <Link href="/" className={`text-white text-[16px] relative ${isActive('/') ? 'font-bold' : 'font-normal opacity-80 hover:opacity-100'}`}>
                            Explore
                            {isActive('/') && (
                                <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#8979FF] rounded-full" />
                            )}
                        </Link>
                        <Link href="/map" className={`text-white text-[16px] relative ${isActive('/map') ? 'font-bold' : 'font-normal opacity-80 hover:opacity-100'}`}>
                            Map
                            {isActive('/map') && (
                                <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#8979FF] rounded-full" />
                            )}
                        </Link>
                        <Link href="/dishlist-100" className={`text-white text-[16px] relative ${isActive('/dishlist-100') ? 'font-bold' : 'font-normal opacity-80 hover:opacity-100'}`}>
                            dishlist 100
                            {isActive('/dishlist-100') && (
                                <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#8979FF] rounded-full" />
                            )}
                        </Link>
                        <Link href="/my-list" className={`text-white text-[16px] relative ${isActive('/my-list') ? 'font-bold' : 'font-normal opacity-80 hover:opacity-100'}`}>
                            My dishlist
                            {isActive('/my-list') && (
                                <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#8979FF] rounded-full" />
                            )}
                        </Link>
                    </nav>

                    {/* Right Side: Welcome to + City Selector + Menu */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-white text-[16px]">Welcome to</span>
                        <CitySelector />
                        <button className="text-white p-1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden pt-12 pb-4">
                    {/* Top Row: Menu, Logo, Profile */}
                    <div className="flex justify-between items-center mb-6">
                        {/* Hamburger Menu */}
                        <button className="text-white p-1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link href="/" className="relative w-[102px] h-[24px]">
                            <Image
                                src="/type=dishlist.svg"
                                alt="dishlist"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>

                        {/* Profile Icon */}
                        <Link href="/profile" className="text-white p-1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex justify-between items-center relative px-2">
                        <Link href="/" className={`flex flex-col items-center gap-1 relative group ${isActive('/') ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
                            <span className={`text-white text-[16px] ${isActive('/') ? 'font-bold' : 'font-normal'}`}>Explore</span>
                            {isActive('/') && (
                                <div className="absolute -bottom-[16px] w-[44px] h-[6px] bg-[#8979FF] rounded-t-[4px]" />
                            )}
                        </Link>

                        <Link href="/map" className={`flex flex-col items-center gap-1 relative group ${isActive('/map') ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
                            <span className={`text-white text-[16px] ${isActive('/map') ? 'font-bold' : 'font-normal'}`}>Map</span>
                            {isActive('/map') && (
                                <div className="absolute -bottom-[16px] w-[44px] h-[6px] bg-[#8979FF] rounded-t-[4px]" />
                            )}
                        </Link>

                        <Link href="/dishlist-100" className={`flex flex-col items-center gap-1 relative group ${isActive('/dishlist-100') ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
                            <span className={`text-white text-[16px] ${isActive('/dishlist-100') ? 'font-bold' : 'font-normal'}`}>dishlist 100</span>
                            {isActive('/dishlist-100') && (
                                <div className="absolute -bottom-[16px] w-[44px] h-[6px] bg-[#8979FF] rounded-t-[4px]" />
                            )}
                        </Link>

                        <Link href="/my-list" className={`flex flex-col items-center gap-1 relative group ${isActive('/my-list') ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
                            <span className={`text-white text-[16px] ${isActive('/my-list') ? 'font-bold' : 'font-normal'}`}>My dishlist</span>
                            {isActive('/my-list') && (
                                <div className="absolute -bottom-[16px] w-[44px] h-[6px] bg-[#8979FF] rounded-t-[4px]" />
                            )}
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
