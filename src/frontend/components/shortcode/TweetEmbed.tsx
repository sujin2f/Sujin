import React, { useEffect, useRef } from 'react'

import { useScriptLoader } from 'src/common/hooks/useScriptLoader'
import { LoadingStatus } from 'src/common/constants/asset'

import { AttrMatch } from 'src/types/wordpress'
import { replaceQuotes } from 'src/frontend/utils/single'

interface Props {
    value: AttrMatch
}

export const TweetEmbed = (props: Props) => {
    const ref = useRef<HTMLDivElement>(null)
    const state = useScriptLoader('//platform.twitter.com/widgets.js')
    const twttr = window.twttr
    const id = replaceQuotes(props.value.named, 'id')

    useEffect(() => {
        if (state === LoadingStatus.DONE && twttr) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            twttr.ready().then(({ widgets }: any) => {
                if (ref.current) {
                    ref.current.innerHTML = ''
                }
                widgets.createTweetEmbed(id, ref.current, {})
            })
        }
    }, [state, twttr, id])

    return <div ref={ref} />
}
