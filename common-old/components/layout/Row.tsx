import { createElement } from 'react'
import type { HTMLElementType, DetailedHTMLProps, HTMLAttributes } from 'react'
/* Helpers */
import { joinClassNames } from '@common/utils/string'

type Props<T extends HTMLElement> = DetailedHTMLProps<HTMLAttributes<T>, T> & {
    readonly className?: string
    readonly dom?: HTMLElementType
    readonly fullWidth?: boolean
}

/**
 * Row component that renders a responsive row container.
 *
 * @param {ReactNode} [props.children] - The content to display in the column.
 * @param {string} [props.className] - Additional class names for the row.
 * @param {string} [props.id] - The id of the row.
 * @param {JSX.ElementType} [props.dom] - The DOM element or component to use for the row.
 * @deprecated
 */
function Row<T extends HTMLElement>({ className: propClassName, dom, fullWidth, children, ...props }: Props<T>) {
    const type = dom || 'div'
    const className = joinClassNames('row', propClassName, fullWidth && 'row--full-width')

    return createElement(
        type,
        {
            className,
            ...props,
        },
        children,
    )
}

export default Row
