import React, { createElement, JSX, PropsWithChildren, useState } from 'react'
import { CloseButton } from '@common/components/forms/CloseButton'
import { className } from '@common/utils/string'

import '@common/scss/callout.scss'

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
    const children = [
        props.children,
        closeButton && <CloseButton onClick={() => setClosed(true)} />,
    ]

    if (closed) {
        return
    }

    return createElement(
        type,
        {
            className: className('callout', props.className),
        },
        children,
    )
}
