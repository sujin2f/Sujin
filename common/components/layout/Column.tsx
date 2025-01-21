import { PropsWithChildren, createElement } from 'react'

/* Helpers */
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/layout.scss'

export type OneToEleven = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type OneToTwelve = OneToEleven | 12
type Props = PropsWithChildren<{
    readonly small?: OneToTwelve
    readonly smallOffset?: OneToEleven
    readonly medium?: OneToTwelve
    readonly mediumOffset?: OneToEleven
    readonly large?: OneToTwelve
    readonly largeOffset?: OneToEleven
    readonly larger?: OneToTwelve
    readonly largerOffset?: OneToEleven
    readonly className?: string
    readonly id?: string
    readonly dom?: string | React.ElementType
}>

/**
 * Column component that renders a responsive column with various size and offset options.
 *
 * @param {ReactNode} [props.children] - The content to display in the column.
 * @param {OneToTwelve} [props.small] - The column size for small screens.
 * @param {OneToEleven} [props.smallOffset] - The column offset for small screens.
 * @param {OneToTwelve} [props.medium] - The column size for medium screens.
 * @param {OneToEleven} [props.mediumOffset] - The column offset for medium screens.
 * @param {OneToTwelve} [props.large] - The column size for large screens.
 * @param {OneToEleven} [props.largeOffset] - The column offset for large screens.
 * @param {OneToTwelve} [props.larger] - The column size for larger screens.
 * @param {OneToEleven} [props.largerOffset] - The column offset for larger screens.
 * @param {string} [props.className] - Additional class names for the column.
 * @param {string} [props.id] - The id of the column.
 * @param {string | React.ElementType} [props.dom] - The DOM element or component to use for the column.
 */
export const Column = (props: Props) => {
    const small = props.small && `small-${props.small}`
    const medium = props.medium && `medium-${props.medium}`
    const large = props.large && `large-${props.large}`
    const larger = props.larger && `larger-${props.larger}`
    const smallOffset = props.smallOffset && `small-offset-${props.smallOffset}`
    const mediumOffset =
        props.mediumOffset && `medium-offset-${props.mediumOffset}`
    const largeOffset = props.largeOffset && `large-offset-${props.largeOffset}`
    const largerOffset =
        props.largerOffset && `larger-offset-${props.largerOffset}`

    return createElement(
        props.dom || 'div',
        {
            className: joinClassNames(
                'column',
                props.className,
                small,
                medium,
                large,
                larger,
                smallOffset,
                mediumOffset,
                largeOffset,
                largerOffset,
            ),
            id: props.id,
        },
        props.children,
    )
}
