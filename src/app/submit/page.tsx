'use client'

import { useCity } from '@/contexts/CityContext'
import { useState } from 'react'

export default function SubmitPage() {
    const { currentCity } = useCity()
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')
        // Simulate API call
        setTimeout(() => setStatus('success'), 1500)
    }

    if (status === 'success') {
        return (
            <div className="max-w-md mx-auto px-4 pt-20 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                    ✓
                </div>
                <h1 className="text-3xl font-black mb-2">Thanks!</h1>
                <p className="text-gray-500 mb-8">We've added that to our queue for review.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold"
                >
                    Add Another
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-black mb-1">Add a Place</h1>
                <p className="text-gray-500">Help us build the best list in {currentCity.name}</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Restaurant Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Pizza Pilgrims"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white">
                        <option>Select a category...</option>
                        <option>Pizza</option>
                        <option>Burgers</option>
                        <option>Fried Chicken</option>
                        <option>Kebabs</option>
                        <option>Curry</option>
                        <option>Fish & Chips</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Location / Area</label>
                    <input
                        type="text"
                        placeholder="e.g. Soho"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Why is it great? (Optional)</label>
                    <textarea
                        rows={3}
                        placeholder="Short one-liner..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'submitting' ? 'Submitting...' : 'Submit Restaurant'}
                </button>
            </form>
        </div>
    )
}
