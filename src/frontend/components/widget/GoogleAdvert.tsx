/** components/widgets/GoogleAdvert */
import React, { useRef, useEffect, Fragment } from 'react'

interface Props {
    client?: string
    responsive?: boolean
    slot?: string
}

export const GoogleAdvert = (props: Props): JSX.Element => {
    const { client, responsive, slot } = props

    const adRef = useRef<HTMLModElement>(null)

    useEffect((): void => {
        if (
            !adRef.current ||
            (adRef.current && adRef.current.classList.contains('loaded'))
        ) {
            return
        }

        adRef.current.classList.add('loaded')

        if (!adRef.current.offsetWidth) {
            return
        }

        if (!adRef.current.offsetParent) {
            return
        }

        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    })

    if (!client || !slot) {
        return <Fragment />
    }

    return (
        <section className="widget google-advert">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive={responsive ? 'true' : 'false'}
                ref={adRef}
            />
        </section>
    )
}
