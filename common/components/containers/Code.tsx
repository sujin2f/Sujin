import React, { useState } from 'react'
import Script from 'next/script'

import { className as getClassName } from '../../utils/string'
import { languages } from '../../constants/helper'

import { map } from '../../utils/array'

import '../../scss/code.scss'

type Props = {
    lang?: (typeof languages)[number]
    className?: string
    children: string
}

/**
 * @see https://highlightjs.org/
 */
export const Code = (props: Props) => {
    const { lang, children } = props
    const [languageScript, setLanguageScript] = useState(false)
    const className = getClassName(props.className, 'code')

    const lineCount = (children.match(/\n/g) || []).length + 1

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/default.min.css"
            />
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"
                crossOrigin="anonymous"
                onReady={() => setLanguageScript(true)}
            />
            {languageScript && (
                <Script
                    src={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/${lang}.min.js`}
                    crossOrigin="anonymous"
                    onReady={() => window.hljs.highlightAll()}
                    onError={() => window.hljs.highlightAll()}
                />
            )}
            <pre className={className}>
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
