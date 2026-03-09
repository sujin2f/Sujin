import { useState, useEffect } from 'react'
import type { Nullable } from '@sujin/share/types'

export const useServerAction = <T>(action: () => Promise<T>, skip: boolean = false, force: number = -1) => {
    const [data, setData] = useState<Nullable<T>>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [forced, setForced] = useState<number>(force)

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

        if ((!skip && !loading && !error && !data) || forced !== force) {
            setLoading(true)
            setForced(force)
            doAction()
        }
    }, [action, error, loading, skip, data, force, forced])

    return { data, loading, error }
}
