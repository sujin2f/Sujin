import React from 'react'
/* Helpers */
import { replaceQuotes } from '@lib/utils/replaceQuotes'
import type { T_ShortcodeAttrMatch } from '@sujin/lib/types'

interface Props {
    value: T_ShortcodeAttrMatch
}

export const Gist = (props: Props) => {
    const {
        value: { named },
    } = props

    const id = replaceQuotes(named, 'id')
    const file = replaceQuotes(named, 'file') || ''

    const arg = file ? `?file=${file}` : ''
    const link = `https://gist.github.com/${id}.js${arg}`
    const script = `<script type="text/javascript" src="${link}"></script>`

    return (
        <>
            Gist
            <iframe
                title="Gist"
                className="gist"
                src={`data:text/html;charset=utf-8,
            <head>
                ${script}
            </head>
            <body></body>`}
            />
        </>
    )
}
