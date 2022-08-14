import React, { MouseEventHandler, PropsWithChildren } from 'react'
import { Link as ReactLink } from 'react-router-dom'

type Props = {
    className?: string
    dangerouslySetInnerHTML?: { __html: string }
    itemType?: string
    rel?: string
    title?: string
    onClick?: MouseEventHandler
    to: string
}

export const Link = (props: PropsWithChildren<Props>): JSX.Element => {
    const {
        children,
        className,
        dangerouslySetInnerHTML,
        itemType,
        rel,
        title,
        onClick,
    } = props

    const to = props.to.replace(window.globalVariable.frontend || '', '')

    return (
        <ReactLink
            to={to}
            className={className}
            itemType={itemType}
            rel={rel}
            title={title}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            onClick={onClick}
        >
            {children}
        </ReactLink>
    )
}
