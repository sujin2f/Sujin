import React from 'react'
import Script from 'next/script'
/* Constants */
import { IS_DEV } from '@common/constants/helper'

interface Props {
    readonly responsive?: boolean
    readonly place: 'footer' | 'sidebar'
}

export const GoogleAdvert = (props: Props) => {
    const { responsive } = props

    const client = process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT
    const slot =
        props.place === 'footer'
            ? process.env.NEXT_PUBLIC_FOOTER_GOOGLE_AD_SLOT
            : process.env.NEXT_PUBLIC_SIDEBAR_GOOGLE_AD_SLOT

    if (IS_DEV || !client || !slot) {
        return <></>
    }

    return (
        <>
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
