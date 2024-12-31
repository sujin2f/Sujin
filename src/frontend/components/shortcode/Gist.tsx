import React from 'react'

import { AttrMatch } from 'src/types/wordpress'
import { replaceQuotes as getter } from 'src/frontend/utils/single'

interface Props {
    value: AttrMatch
}

export const Gist = (props: Props): JSX.Element => {
    const {
        value: { named },
    } = props

    const id = getter(named, 'id')
    const file = getter(named, 'file') || ''

    const iFrameId = `gist-${id}-${file}`
    const styles = '<style>*{font-size:12px}</style>'
    const arg = file ? `?file=${file}` : ''
    const link = `https://gist.github.com/${id}.js${arg}`
    const script = `<script type="text/javascript" src="${link}"></script>`

    // TODO use fetch

    return (
        <iframe
            title={iFrameId}
            width="100%"
            height="1000"
            frameBorder="0"
            src={`data:text/html;charset=utf-8,
            <head>
                ${styles}
                ${script}
            </head>
            <body></body>`}
        />
    )
}
