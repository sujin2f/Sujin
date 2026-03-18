'use client'
import { useEffect } from 'react'

interface Props {
    readonly responsive?: boolean
    readonly place: 'footer' | 'sidebar'
    readonly clientId: string
    readonly slot: string
}

export const GoogleAdvert = ({ clientId, responsive, slot }: Props) => {
    useEffect(() => {
        const handleRouteChange = () => {
            if (!clientId || !slot) return

            const intervalId = setInterval(() => {
                try {
                    // Check if the 'ins' element already has an ad in it
                    if (window.adsbygoogle) {
                        window.adsbygoogle.push({})
                        clearInterval(intervalId)
                    }
                } catch {
                    clearInterval(intervalId) // Ensure we clear interval on errors too
                }
            }, 100)

            return () => clearInterval(intervalId) // Clear interval on component unmount
        }

        // Run the function when the component mounts
        handleRouteChange()

        return () => {
            handleRouteChange()
        }
    }, [clientId, slot])

    if (!clientId || !slot) return <></>

    return (
        <>
            <section className="">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%' }}
                    data-ad-client={clientId}
                    data-ad-slot={slot}
                    data-ad-format="auto"
                    data-full-width-responsive={responsive ? 'true' : 'false'}
                ></ins>
            </section>
        </>
    )
}
