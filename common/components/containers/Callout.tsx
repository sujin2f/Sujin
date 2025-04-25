'use client'
import {
    type HTMLAttributes,
    type DetailedHTMLProps,
    type JSX,
    type PropsWithChildren,
    createElement,
    useState,
} from 'react'
/* Components */
import { CloseButton } from '../forms/CloseButton'
/* Helpers */
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/callout.scss'

type Props = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> &
    PropsWithChildren<{
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
const Callout = ({
    closeButton,
    dom = 'div',
    className,
    children,
    ...props
}: Props) => {
    const [closed, setClosed] = useState(false)

    if (closed) {
        return
    }

    return createElement(
        dom,
        {
            className: joinClassNames('callout', className),
            ...props,
        },
        children,
        closeButton && <CloseButton onClick={() => setClosed(true)} />,
    )
}
export default Callout
