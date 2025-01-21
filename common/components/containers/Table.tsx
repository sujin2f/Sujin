import React, { type PropsWithChildren, type ReactNode } from 'react'

/* Helpers */
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/table.scss'

type Props = PropsWithChildren<{
    readonly scroll?: boolean
    readonly center?: boolean
    readonly caption?: ReactNode
    readonly className?: string
}>

/**
 * Table component that displays a table with optional scrolling, centering, and caption.
 *
 * @param {ReactNode} [props.children] - The content to display in the table.
 * @param {boolean} [props.scroll] - Whether the table should be scrollable.
 * @param {boolean} [props.center] - Whether the table should be centered.
 * @param {ReactNode} [props.caption] - The caption for the table.
 * @param {string} [props.className] - Additional class names for the table.
 */
export const Table = ({
    scroll,
    center,
    caption,
    className,
    children,
}: Props) => {
    return (
        <div
            className={joinClassNames(
                'table',
                scroll && 'table--scroll',
                center && 'table--center',
                className && `table--${className}`,
            )}
        >
            <div className="table__container">
                <table>
                    {caption && (
                        <caption className="caption">
                            <div className="caption__text">{caption}</div>
                        </caption>
                    )}
                    {children}
                </table>
            </div>
        </div>
    )
}
