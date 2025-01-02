import React, { useRef } from 'react'

import { AttrMatch } from 'src/types/wordpress'
import { replaceQuotes as getter } from 'src/frontend/utils/single'

require('src/frontend/scss/gist.scss')

interface Props {
    value: AttrMatch
}

export const Gist = (props: Props): JSX.Element => {
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
            className="gist"
            frameBorder="0"
            src={`data:text/html;charset=utf-8,
            <head>
                ${script}
            </head>
            <body></body>`}
        />
    )
}
