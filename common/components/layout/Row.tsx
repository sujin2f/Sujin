import { type JSX, type PropsWithChildren, createElement } from 'react'

/* Helpers */
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/layout.scss'

type Props = PropsWithChildren<{
    readonly className?: string
    readonly dom?: JSX.ElementType
    readonly fullWidth?: boolean
}>

/**
 * Row component that renders a responsive row container.
 *
 * @param {ReactNode} [props.children] - The content to display in the column.
 * @param {string} [props.className] - Additional class names for the row.
 * @param {string} [props.id] - The id of the row.
 * @param {JSX.ElementType} [props.dom] - The DOM element or component to use for the row.
 */
export function Row({
    className: propClassName,
    dom,
    fullWidth,
    children,
}: Props) {
    const type = dom || 'div'
    const className = joinClassNames(
        'row',
        propClassName,
        fullWidth && 'row--full-width',
    )

    return createElement(
        type,
        {
            className,
        },
        children,
    )
}
