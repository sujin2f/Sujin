import { useState, useEffect } from 'react'
import type { Nullable } from '@sujin/share/types'

export const useServerAction = <T>(action: () => Promise<T>) => {
    const [data, setData] = useState<Nullable<T>>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        ;(async () => {
            await action()
                .then((data) => {
                    setLoading(false)
                    setData(data)
                })
                .catch((e) => setError(e))
        })()
    }, [action])

    return { data, loading, error }
}
