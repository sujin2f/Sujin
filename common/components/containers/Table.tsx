import React, { type PropsWithChildren, type ReactNode } from 'react'

import { className as getClassName } from '../../utils/string'

import '../../scss/table.scss'

type Props = {
    readonly scroll?: boolean
    readonly center?: boolean
    readonly caption?: ReactNode
    readonly className?: string
}

export const Table = ({
    scroll,
    center,
    caption,
    className: cls,
    children,
}: PropsWithChildren<Props>) => {
    const className = getClassName(
        'table',
        scroll && 'table--scroll',
        center && 'table--center',
        cls && `table--${cls}`,
    )
    return (
        <div className={className}>
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
