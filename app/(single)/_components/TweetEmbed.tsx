'use client'
import React, { useRef } from 'react'
import Script from 'next/script'
/* Helpers */
import { replaceQuotes } from '@app/(single)/utils'
import type { AttrMatch } from '@app/_lib/types/wordpress'

interface Props {
    value: AttrMatch
}

export const TweetEmbed = (props: Props) => {
    const ref = useRef<HTMLDivElement>(null)
    const id = replaceQuotes(props.value.named, 'id')
    return (
        <>
            <Script
                src="//platform.twitter.com/widgets.js"
                crossOrigin="anonymous"
                onReady={() => {
                    if (window.twttr) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        window.twttr.ready().then(({ widgets }: any) => {
                            if (ref.current) {
                                ref.current.innerHTML = ''
                            }
                            widgets.createTweetEmbed(id, ref.current, {})
                        })
                    }
                }}
            />
            <div ref={ref} />
        </>
    )
}
