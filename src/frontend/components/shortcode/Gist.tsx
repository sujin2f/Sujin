import React from 'react'

import { AttrMatch } from '@project/types/wordpress'
import { replaceQuotes as getter } from '@frontend/utils/single'

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
        <iframe
            title="Gist"
            className="gist"
            src={`data:text/html;charset=utf-8,
            <head>
                ${script}
            </head>
            <body></body>`}
        />
    )
}
