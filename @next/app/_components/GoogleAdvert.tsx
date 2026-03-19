'use client'
import { useEffect, useState } from 'react'

interface Props {
    readonly responsive?: boolean
    readonly clientId: string
    readonly slot: string
}

export const GoogleAdvert = ({ clientId, responsive, slot }: Props) => {
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()

    useEffect(() => {
        const handleRouteChange = () => {
            if (!clientId || !slot || intervalId) return

            const _intervalId = setInterval(() => {
                if (!window.adsbygoogle) return

                try {
                    // Check if the 'ins' element already has an ad in it
                    window.adsbygoogle.push({})
                    clearInterval(_intervalId)
                } catch {}
            }, 100)

            setIntervalId(_intervalId)
        }

        // Run the function when the component mounts
        handleRouteChange()

        return () => {
            // Clear interval on component unmount
            if (!clientId || !slot || !intervalId) return

            clearInterval(intervalId)
            setIntervalId(undefined)
        }
    }, [clientId, slot, intervalId])

    if (!clientId || !slot) return <></>

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={clientId}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive={responsive ? 'true' : 'false'}
        ></ins>
    )
}
