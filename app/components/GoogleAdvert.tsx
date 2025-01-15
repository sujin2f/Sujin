import Script from 'next/script'
import React, { useRef, useEffect, Fragment } from 'react'

interface Props {
    readonly responsive?: boolean
}

export function GoogleAdvert(props: Props) {
    const { responsive } = props
    const adRef = useRef<HTMLModElement>(null)

    const client = process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT
    const slot = process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT

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

    if (process.env.NODE_ENV === 'development' || !client || !slot) {
        return <Fragment></Fragment>
    }

    if (!client || !slot) {
        return <Fragment></Fragment>
    }

    return (
        <>
            <Script
                async
                src="https://www.googletagmanager.com/gtag/js?id=UA-37266518-1"
                crossOrigin="anonymous"
            ></Script>
            <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.GOOGLE_AD_CLIENT}`}
                crossOrigin="anonymous"
            ></Script>
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
        </>
    )
}
