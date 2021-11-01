/*
 * Global Footer Bottom Element Component
 * components/common/Link
 */

import React from 'react'
import { Link as ReactLink } from 'react-router-dom'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ReactChildrenProps } from 'src/types'

interface Props extends ReactChildrenProps {
    className?: string
    dangerouslySetInnerHTML?: { __html: string }
    itemType?: string
    rel?: string
    title?: string
    to: string
}

export const Link = (props: Props): JSX.Element => {
    const {
        children,
        className,
        dangerouslySetInnerHTML,
        itemType,
        rel,
        title,
    } = props

    const to = props.to.replace(window.globalVariable.frontend, '')

    return (
        <ReactLink
            to={to}
            className={className}
            itemType={itemType}
            rel={rel}
            title={title}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        >
            {children}
        </ReactLink>
    )
}