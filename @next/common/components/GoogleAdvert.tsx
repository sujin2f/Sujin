import React from 'react'
import Script from 'next/script'
/* CONSTANTS */
import { IS_DEV } from '@sujin/share/constants/helper'

interface Props {
    readonly responsive?: boolean
    readonly place: 'footer' | 'sidebar'
    readonly clientId: string
    readonly slot: string
}

export const GoogleAdvert = ({ clientId, responsive, slot }: Props) => {
    if (IS_DEV || !clientId || !slot) {
        return <></>
    }

    return (
        <>
            <section className="">
                <ins
                    className="adsbygoogle"
                    data-ad-client={clientId}
                    data-ad-format="auto"
                    data-ad-slot={slot}
                    data-full-width-responsive={responsive ? 'true' : 'false'}
                    style={{ display: 'block', width: '100%' }}
                />
                <Script id={`google-ad-script-${slot}`}>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
            </section>
        </>
    )
}
