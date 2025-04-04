import React from 'react'
/* Helpers */
import { replaceQuotes } from '@src/utils/single'
import type { AttrMatch } from '@src/types/wordpress'

interface Props {
    value: AttrMatch
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
