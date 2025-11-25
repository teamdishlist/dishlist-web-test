import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="text-9xl mb-4">🍽️</div>
            <h1 className="text-4xl font-black mb-2 text-gray-900">404</h1>
            <h2 className="text-xl font-bold mb-4 text-gray-700">Page Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                Looks like this dish is off the menu. Let's get you back to the good stuff.
            </p>
            <Link
                href="/"
                className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition active:scale-[0.98]"
            >
                Go Home
            </Link>
        </div>
    )
}
