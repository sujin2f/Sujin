import React, { useEffect, useState } from 'react'
import { className as getClassName } from '../../utils/string'
import { languages } from '../../constants/helper'

import { useStyleLoader } from 'src/common/hooks/useStyleLoader'
import { useScriptLoader } from 'src/common/hooks/useScriptLoader'
import { LoadingStatus } from 'src/common/constants/asset'

import 'src/common/scss/code.scss'
import { map } from 'src/common/utils/array'

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
    const [loadLang, setLoadLang] = useState(true)
    const className = getClassName(props.className, 'code')

    useStyleLoader(
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/default.min.css',
    )
    const highlightLoaded = useScriptLoader(
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js',
    )

    // Delayed embed a language file
    useScriptLoader(
        `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/${lang}.min.js`,
        {
            disable: loadLang,
            onLoad: () => window.hljs.highlightAll(),
            onError: () => window.hljs.highlightAll(),
        },
    )

    useEffect(() => {
        if (highlightLoaded === LoadingStatus.DONE) {
            setLoadLang(false)
        }
    }, [highlightLoaded, lang])

    const lineCount = (children.match(/\n/g) || []).length + 1

    return (
        <pre className={className}>
            <div className={`code__lines code__lines--${lang}`}>
                {map(lineCount, (_, index) => (
                    <div key={`code__lines__${children}__${index}`} />
                ))}
            </div>
            <code className={`language-${lang} hljs`}>{children}</code>
        </pre>
    )
}
