import React, { PropsWithChildren, useMemo } from 'react'
import { generateUUID } from '../../utils/string'
import { className as getClassName } from '../../utils/string'

import '@common/scss/code.scss'
import { trimStart } from '../../utils/array'

type Props = {
    lang?: 'shell' | 'js' | 'ts' | 'json' | 'py' | 'php' | 'scss' | 'css'
    className?: string
}

export const Code = (props: PropsWithChildren<Props>) => {
    const { lang } = props
    const className = getClassName(props.className, 'code')
    const key = useMemo(
        () => `code-${generateUUID()}-${lang}-${className}`,
        [lang, className],
    )
    const children = (props.children?.toString() || '')
        .split('\n')
        .map((txt, index) => (txt ? <p key={`${key}-${index}`}>{txt}</p> : ''))

    return (
        <code className={className} data-lang={lang}>
            {trimStart(children)}
        </code>
    )
}
