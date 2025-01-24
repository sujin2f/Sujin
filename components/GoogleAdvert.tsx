'use client'
import Script from 'next/script'
import React, { Fragment } from 'react'

interface Props {
    readonly responsive?: boolean
    readonly place: 'footer' | 'sidebar'
}

export function GoogleAdvert(props: Props) {
    const { responsive } = props

    const client = process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT
    const slot =
        props.place === 'footer'
            ? process.env.NEXT_PUBLIC_FOOTER_GOOGLE_AD_SLOT
            : process.env.NEXT_PUBLIC_SIDEBAR_GOOGLE_AD_SLOT

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
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
                crossOrigin="anonymous"
            ></Script>
            <section className="widget google-advert">
                <ins
                    className="adsbygoogle"
                    data-ad-client={client}
                    data-ad-format="auto"
                    data-ad-slot={slot}
                    data-full-width-responsive={responsive ? 'true' : 'false'}
                    style={{ display: 'block', width: '100%' }}
                />
                <Script
                    id={`google-ad-script-${slot}`}
                >{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
            </section>
        </>
    )
}
