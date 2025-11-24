import { useEffect, useState } from 'react'

export const useNextClient = () => {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])
    return isClient
}
