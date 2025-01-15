import React, { type PropsWithChildren, type ReactNode } from 'react'

import { className as getClassName } from '../../utils/string'

import '../../scss/table.scss'

type Props = {
    readonly scroll?: boolean
    readonly center?: boolean
    readonly caption?: ReactNode
}

export const Table = ({
    scroll,
    center,
    caption,
    children,
}: PropsWithChildren<Props>) => {
    const className = getClassName(
        'table',
        scroll && 'table--scroll',
        center && 'table--center',
    )
    return (
        <div className={className}>
            <div className="table__container">
                <table>
                    {caption && <caption>{caption}</caption>}
                    {children}
                </table>
            </div>
        </div>
    )
}
