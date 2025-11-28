'use client'

import { useState, useRef, useEffect } from 'react'

export default function CitySelector() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 0C7.32608 0 8.59747 0.527162 9.53516 1.46484C10.4728 2.40253 11 3.67392 11 5C11 6.95085 9.75812 8.69776 8.61328 9.90625C8.03061 10.5213 7.44939 11.022 7.01465 11.3682C6.79706 11.5414 6.6149 11.6767 6.48633 11.7695C6.42199 11.816 6.37047 11.8524 6.33496 11.877C6.31739 11.8891 6.30361 11.8987 6.29395 11.9053L6.2793 11.915L6.27832 11.916H6.27734C6.1305 12.0139 5.9447 12.0264 5.78809 11.9531L5.72266 11.916L5.7207 11.915L5.70605 11.9053C5.69639 11.8987 5.68261 11.8891 5.66504 11.877C5.62953 11.8524 5.57801 11.816 5.51367 11.7695C5.3851 11.6767 5.20294 11.5414 4.98535 11.3682C4.55061 11.022 3.96939 10.5213 3.38672 9.90625C2.24188 8.69776 1 6.95085 1 5C1 3.67392 1.52716 2.40253 2.46484 1.46484C3.40253 0.527162 4.67392 0 6 0ZM6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5Z" fill="#FF2D55" />
                </svg>
                <span className="font-bold text-[#180400] text-base">London</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <path d="M1 1L5 5L9 1" stroke="#180400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="py-1">
                        <button
                            className="w-full px-4 py-2 text-left text-sm font-medium text-[#180400] bg-gray-50 flex items-center justify-between"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>London</span>
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 4L3.5 6.5L9 1" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-400 cursor-not-allowed flex items-center gap-2"
                            disabled
                        >
                            <span>NYC</span>
                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">Coming soon</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
