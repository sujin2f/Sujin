import React, { useRef } from 'react'

interface Props {
    id: string
    file: string
}

export const Gist = (props: Props): JSX.Element => {
    const { id, file } = props
    const frameRef = useRef<HTMLIFrameElement>(null)
    const iFrameId = file ? `gist-${id}-${file}` : `gist-${id}`

    const styles = '<style>*{font-size:12px}</style>'
    const fileArg = file ? `?file=${file}` : ''
    const gistLink = `https://gist.github.com/${id}.js${fileArg}`
    const gistScript = `<script type="text/javascript" src="${gistLink}"></script>`

    // TODO use fetch

    return (
        <iframe
            title={iFrameId}
            ref={frameRef}
            width="100%"
            height="1000"
            frameBorder="0"
            src={`data:text/html;charset=utf-8,
            <head>
                ${styles}
                ${gistScript}
            </head>
            <body></body>`}
        />
    )
}
