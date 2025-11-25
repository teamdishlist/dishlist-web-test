'use client'

import Link from 'next/link'

export default function RestaurantPage() {
    return (
        <div className="max-w-md mx-auto bg-white min-h-screen">
            {/* Hero Image Placeholder */}
            <div className="h-64 bg-gray-200 w-full relative">
                <Link href="/" className="absolute top-6 left-4 bg-white/90 p-2 rounded-full shadow-sm backdrop-blur-sm">
                    ← Back
                </Link>
            </div>

            <div className="px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-6">
                    <h1 className="text-2xl font-black mb-1">Pizza Pilgrims</h1>
                    <p className="text-gray-500 text-sm mb-4">Soho • Pizza</p>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                            #1 in London Pizza
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            Open Now
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Your Rating</p>
                            <span className="text-3xl font-black text-indigo-600">9.2</span>
                        </div>
                        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
                            Edit Rating
                        </button>
                    </div>
                </div>

                <div className="space-y-6 mb-12">
                    <section>
                        <h3 className="font-bold text-gray-900 mb-3">Your Review</h3>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-gray-700 italic">"Best crust in London, hands down. The Nduja pizza is absolutely incredible."</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-3">Voice Note</h3>
                        <div className="bg-gray-900 text-white p-4 rounded-xl flex items-center gap-4">
                            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                ▶
                            </button>
                            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-indigo-400"></div>
                            </div>
                            <span className="text-xs font-mono">0:08</span>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-3">Location</h3>
                        <div className="h-40 bg-gray-200 rounded-xl w-full flex items-center justify-center text-gray-400 text-sm">
                            Map View Stub
                        </div>
                        <p className="text-sm text-gray-500 mt-2">11 Dean St, London W1D 3RP</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
