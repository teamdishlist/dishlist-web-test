import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Login({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    const signIn = async (formData: FormData) => {
        'use server'

        const email = formData.get('email') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${(await headers()).get('origin')}/auth/callback`,
            },
        })

        if (error) {
            return redirect('/login?message=Could not authenticate user')
        }

        return redirect('/login?message=Check email to continue sign in process')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black mb-2">DishList</h1>
                    <p className="text-gray-500">Sign in to save your favorite places</p>
                </div>

                <form className="flex flex-col gap-4" action={signIn}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                            name="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <button className="bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition active:scale-[0.98]">
                        Send Magic Link
                    </button>

                    {searchParams?.message && (
                        <p className="mt-4 p-4 bg-indigo-50 text-indigo-700 rounded-xl text-center text-sm font-medium">
                            {searchParams.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
