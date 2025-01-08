import React, { useEffect } from 'react'

import { AttrMatch } from '@src/types/wordpress'
import { replaceQuotes as getter } from '@src/frontend/utils/single'
import { useStyleLoader } from '@src/common/hooks/useStyleLoader'
import { useScriptLoader } from '@src/common/hooks/useScriptLoader'
import { LoadingStatus } from '@src/common/constants/asset'

interface Props {
    value: AttrMatch
}

export const Code = (props: Props) => {
    const {
        value: { named },
    } = props
    const lang = getter(named, 'lang')
    const content = getter(named, 'innerContent')

    useStyleLoader(
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css',
    )
    const highlightLoaded = useScriptLoader(
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
    )

    useEffect(() => {
        if (highlightLoaded === LoadingStatus.DONE) {
            window.hljs.highlightAll()
        }
    }, [highlightLoaded])

    return (
        <pre className="code">
            <code className={`language-${lang}`}>
                {content.replace(/<br \/>/gi, '')}
            </code>
        </pre>
    )
}
