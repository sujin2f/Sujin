import React from 'react'

import { AttrMatch } from '@src/types/wordpress'
import { replaceQuotes as getter } from '@src/utils/single'

interface Props {
    value: AttrMatch
}

export const Gist = (props: Props) => {
    const {
        value: { named },
    } = props

    const id = getter(named, 'id')
    const file = getter(named, 'file') || ''

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
