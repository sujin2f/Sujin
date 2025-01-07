/** components/widgets/GoogleAdvert */
import React, { useRef, useEffect, Fragment } from 'react'

interface Props {
    readonly client?: string
    readonly responsive?: boolean
    readonly slot?: string
}

export function GoogleAdvert(props: Props) {
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
        return <Fragment></Fragment>
    }

    return (
        <section className="widget google-advert">
            <ins
                className="adsbygoogle"
                data-ad-client={client}
                data-ad-format="auto"
                data-ad-slot={slot}
                data-full-width-responsive={responsive ? 'true' : 'false'}
                ref={adRef}
                style={{ display: 'block', width: '100%' }}
            />
        </section>
    )
}
