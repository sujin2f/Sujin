import React, { createElement, JSX, PropsWithChildren, useState } from 'react'
import { CloseButton } from '../forms/CloseButton'
import { className } from '../../utils/string'

import '../../scss/callout.scss'

type Props = {
    className?: string
    closeButton?: boolean
    dom?: string | JSX.ElementType
}

/**
 * @param {{className?: string, closeButton?: boolean, dom?: string | JSX.ElementType}} props
 */
export const Callout = (props: PropsWithChildren<Props>) => {
    const { closeButton, dom } = props
    const [closed, setClosed] = useState(false)

    const type = dom || 'div'

    if (closed) {
        return
    }

    return createElement(
        type,
        {
            className: className('callout', props.className),
        },
        props.children,
        closeButton && <CloseButton onClick={() => setClosed(true)} />,
    )
}
