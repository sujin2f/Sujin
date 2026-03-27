'use client'
import { useEffect, useState } from 'react'
import Script from 'next/script'
/* Helpers */
import { useStyleLoader } from '../../../app/_lib/hooks/useStyleLoader'
import { joinClassNames } from '@common/utils/string'
import { languages } from '@common/constants/helper'
import { map } from '@common/utils/array'

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
    useStyleLoader(`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${highlightVersion}/styles/default.min.css`)
    const [hljs, setHljs] = useState(false)
    const lineCount = (children.match(/\n/g) || []).length + 1

    useEffect(() => {
        if (!hljs && window.hljs) {
            setHljs(true)
        }
    }, [hljs])

    return (
        <>
            <Script
                src={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${highlightVersion}/highlight.min.js`}
                crossOrigin="anonymous"
                onReady={() => setHljs(true)}
            />
            {hljs && (
                <Script
                    src={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${highlightVersion}/languages/${lang}.min.js`}
                    crossOrigin="anonymous"
                    onReady={() => (window.hljs ? window.hljs.highlightAll() : setHljs(false))}
                    onError={() => (window.hljs ? window.hljs.highlightAll() : setHljs(false))}
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
