'use client'
import React, { useEffect } from 'react'
import Script from 'next/script'

/* Helpers */
import { joinClassNames } from '../../utils/string'
import { languages } from '../../constants/helper'
import { map } from '../../utils/array'
/* Assets */
import '../../scss/code.scss'
import { useGlobalState } from '@common/hooks/useGlobalState'
import { useStyleLoader } from '@common/hooks/useStyleLoader'

type Props = {
    readonly lang?: (typeof languages)[number]
    readonly className?: string
    readonly children: string
}

const highlightVersion = '11.11.1'

/**
 * Code component that displays syntax-highlighted code.
 *
 * @param {string} [props.lang] - The programming language of the code.
 * @param {string} [props.className] - Additional class names for the code block.
 * @param {string} props.children - The code to be displayed.
 * @see https://highlightjs.org/
 */
export const Code = ({ lang, children, className }: Props) => {
    useStyleLoader(
        `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${highlightVersion}/styles/default.min.css`,
    )
    const [loaded, setLoaded] = useGlobalState('hljs', false)
    const [scriptLoaded, setScriptLoaded] = useGlobalState(
        lang ? lang.toString() : 'no-script',
        false,
    )
    const lineCount = (children.match(/\n/g) || []).length + 1

    useEffect(() => {
        setLoaded(true)
        setScriptLoaded(true)
    }, [setLoaded, setScriptLoaded])

    return (
        <>
            {loaded && (
                <Script
                    src={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${highlightVersion}/highlight.min.js`}
                    crossOrigin="anonymous"
                />
            )}
            {scriptLoaded && (
                <Script
                    src={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${highlightVersion}/languages/${lang}.min.js`}
                    crossOrigin="anonymous"
                    onReady={() => window.hljs.highlightAll()}
                    onError={() => window.hljs.highlightAll()}
                />
            )}
            <pre className={joinClassNames('code', className)}>
                <div className={`code__lines code__lines--${lang}`}>
                    {map(lineCount, (_, index) => (
                        <div key={`code__lines__${children}__${index}`} />
                    ))}
                </div>
                <code className={`language-${lang} hljs`}>{children}</code>
            </pre>
        </>
    )
}

export default Code
