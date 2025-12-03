import { useState, useEffect } from 'react'
import type { Nullable } from '@sujin/share/types'

export const useServerAction = <T>(action: () => Promise<T>, skip: boolean = false) => {
    const [data, setData] = useState<Nullable<T>>()
    const [loading, setLoading] = useState(!skip)
    const [error, setError] = useState(false)

    useEffect(() => {
        const doAction = async () => {
            await action()
                .then((data) => {
                    setLoading(false)
                    setData(data)
                })
                .catch((e) => setError(e))
        }

        if (!skip) {
            doAction()
        }
    }, [action, skip])

    return { data, loading, error }
}
