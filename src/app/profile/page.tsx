'use client'

import { useCity } from '@/contexts/CityContext'
import Link from 'next/link'

export default function ProfilePage() {
    const { currentCity } = useCity()

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-black mb-1">Profile</h1>
                <p className="text-gray-500">Manage your settings and preferences</p>
            </header>

            <div className="space-y-6">
                {/* User Info Stub */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                        👤
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Guest User</h2>
                        <p className="text-sm text-gray-500">Sign in to sync your list</p>
                    </div>
                </div>

                {/* Settings Section */}
                <section>
                    <h3 className="font-bold text-gray-900 mb-3 px-1">Settings</h3>
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <span className="text-gray-700">Default City</span>
                            <span className="text-indigo-600 font-medium">{currentCity.name}</span>
                        </div>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <span className="text-gray-700">Email Preferences</span>
                            <span className="text-gray-400">›</span>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <span className="text-gray-700">Notifications</span>
                            <div className="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* App Info */}
                <section>
                    <h3 className="font-bold text-gray-900 mb-3 px-1">About</h3>
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <Link href="/about" className="p-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50">
                            <span className="text-gray-700">About DishList</span>
                            <span className="text-gray-400">›</span>
                        </Link>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <span className="text-gray-700">Version</span>
                            <span className="text-gray-400 text-sm">1.0.0 (MVP)</span>
                        </div>
                        <Link href="/credits" className="p-4 flex justify-between items-center hover:bg-gray-50">
                            <span className="text-gray-700">Credits</span>
                            <span className="text-gray-400">›</span>
                        </Link>
                    </div>
                </section>

                {/* Danger Zone */}
                <button className="w-full py-4 text-red-600 font-medium bg-red-50 rounded-xl hover:bg-red-100 transition">
                    Log Out
                </button>
            </div>
        </div>
    )
}
