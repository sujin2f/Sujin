import type { ReactNode, DetailedHTMLProps, TableHTMLAttributes } from 'react'
/* Helpers */
import { joinClassNames } from '@common/utils/string'

type Props = DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> & {
    readonly center?: boolean
    readonly fullWidth?: boolean
    readonly caption?: ReactNode
}

/**
 * Table component that displays a table with optional scrolling, centering, and caption.
 *
 * @param {ReactNode} [props.children] - The content to display in the table.
 * @param {boolean} [props.center] - Whether the table should be centered.
 * @param {boolean} [props.full-width] - Set min-width 100%
 * @param {ReactNode} [props.caption] - The caption for the table.
 * @param {string} [props.className] - Additional class names for the table.
 * @example <Table center><thead><tr><th>...</th></tr></thead></Table>
 */
const Table = ({ center, caption, className, children, fullWidth, ...props }: Props) => {
    return (
        <>
            <div
                className={joinClassNames(
                    'table__container',
                    center && 'table__container--center',
                    fullWidth && 'table__container--full-width',
                    className && `table__container--${className}`,
                )}
            >
                <table className="table" {...props}>
                    {caption && (
                        <caption className="caption">
                            <div className="caption__text">{caption}</div>
                        </caption>
                    )}
                    {children}
                </table>
            </div>
        </>
    )
}

export default Table
