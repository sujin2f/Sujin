import React, { createElement, JSX, PropsWithChildren, useState } from 'react'

/* Components */
import { CloseButton } from '../forms/CloseButton'
/* Helpers */
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/callout.scss'

type Props = PropsWithChildren<{
    readonly className?: string
    readonly closeButton?: boolean
    readonly dom?: string | JSX.ElementType
}>

/**
 * Callout component that displays a container with optional close button.
 *
 * @param {ReactNode} props.children - The content to display in the callout.
 * @param {string} [props.className] - Additional class names for the callout.
 * @param {boolean} [props.closeButton] - Whether to display a close button.
 * @param {string | JSX.ElementType} [props.dom] - The DOM element or component to use for the callout.
 */
const Callout = ({ closeButton, dom, className, children }: Props) => {
    const [closed, setClosed] = useState(false)

    const type = dom || 'div'

    if (closed) {
        return
    }

    return createElement(
        type,
        {
            className: joinClassNames('callout', className),
        },
        children,
        closeButton && <CloseButton onClick={() => setClosed(true)} />,
    )
}
export default Callout
