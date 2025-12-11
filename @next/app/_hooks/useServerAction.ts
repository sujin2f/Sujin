import { useState, useEffect } from 'react'
import type { Nullable } from '@sujin/share/types'

export const useServerAction = <T>(action: () => Promise<T>, skip: boolean = false) => {
    const [data, setData] = useState<Nullable<T>>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const doAction = async () => {
            await action()
                .then((data) => {
                    setLoading(false)
                    setData(data)
                })
                .catch(() => {
                    setLoading(false)
                    setError(true)
                })
        }

        if (!skip && !loading && !error && !data) {
            setLoading(true)
            doAction()
        }
    }, [action, error, loading, skip, data])

    return { data, loading, error }
}
