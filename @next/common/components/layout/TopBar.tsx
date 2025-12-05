import type { JSX, PropsWithChildren } from 'react'
/* Components */
import Row from './Row'
import Column from './Column'
/* Helpers */
import { joinClassNames } from '@sujin/share/utils/string'

type Props = PropsWithChildren<{
    readonly left?: JSX.Element
    readonly right?: JSX.Element
    readonly className?: string
    readonly fullWidth?: boolean
    readonly fixed?: boolean
}>

/**
 * TopBar component that renders a top bar with optional left and right content.
 *
 * @param {ReactNode} [props.children] - The content to display in the column.
 * @param {JSX.Element} [props.left] - The content to display on the left side of the top bar.
 * @param {JSX.Element} [props.right] - The content to display on the right side of the top bar.
 * @param {string} [props.className] - Additional class names for the top bar.
 * @param {boolean} [props.fullWidth] - Whether the top bar should span the full width of the container.
 * @param {boolean} [props.fixed] - Whether the top bar should be fixed at the top of the page.
 */
export function TopBar({ left, right, fullWidth, children, fixed, className }: Props) {
    return (
        <Row
            className={joinClassNames('top-bar', className, fixed && 'top-bar--fixed')}
            dom="section"
            fullWidth={fullWidth}
        >
            {left ? <Column small={6}>{left}</Column> : null}

            {right ? <Column small={6}>{right}</Column> : null}

            {children}
        </Row>
    )
}
