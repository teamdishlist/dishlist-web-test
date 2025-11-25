import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeSubscription<T>(
    table: string,
    callback: (payload: any) => void
) {
    useEffect(() => {
        const channel: RealtimeChannel = supabase
            .channel(`public:${table}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table },
                callback
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [table, callback])
}

export function useSupabaseQuery<T>(
    query: () => Promise<{ data: T | null; error: any }>
) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const { data, error } = await query()
            setData(data)
            setError(error)
            setLoading(false)
        }

        fetchData()
    }, [])

    return { data, loading, error, refetch: () => query() }
}
