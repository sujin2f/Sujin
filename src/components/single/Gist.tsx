/*
 * Content / Gist Component
 * components/single/Gist
 */

import React, { useRef, Fragment } from 'react'

interface Props {
  id: string
  file: string
}

export const Gist = (props: Props): JSX.Element => {
  const refIframe = useRef<HTMLIFrameElement>(null)
  const { id, file } = props
  const iFrameId = file ? `gist-${id}-${file}` : `gist-${id}`

  if (refIframe.current && !refIframe.current.getAttribute('data-loaded')) {
    const fileArg = file ? `?file=${file}` : ''
    const gistLink = `https://gist.github.com/${id}.js${fileArg}`
    const styles = '<style>*{font-size:12px}</style>'
    const resizeScript = `onload="parent.document.getElementById('${iFrameId}').style.height=document.body.scrollHeight + 'px'"`
    const gistScript = `<script type="text/javascript" src="${gistLink}"></script>`
    const iframeHtml = `<html><head><base target="_parent">${styles}</head><body ${resizeScript}>${gistScript}</body></html>`

    if (!refIframe.current.contentDocument) {
      return (<Fragment />)
    }
    refIframe.current.contentDocument.open()
    refIframe.current.contentDocument.write(iframeHtml)
    refIframe.current.contentDocument.close()

    refIframe.current.setAttribute('data-loaded', 'true')
  }

  return (
    <iframe width="100%" frameBorder="0" id={iFrameId} ref={refIframe} title={iFrameId} />
  )
}
