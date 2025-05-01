'use client'
import React from 'react'
import Link from 'next/link'
/* Components */
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* T_Types */
import type { T_PrevNext } from '@app/_lib/types'
/* Assets */
import Icon from '@app/_lib/images/prev.svg'
import '@app/(single)/_components/prev-next.scss'

type Props = {
    readonly prev?: T_PrevNext | false
    readonly next?: T_PrevNext | false
}

export const PrevNext = (props: Props) => {
    const items = {
        prev: props.prev,
        next: props.next,
    }

    return (
        <Row dom="nav" fullWidth className="prev-next">
            {Object.keys(items).map((index) => {
                const key = index as 'prev' | 'next'
                const item = items[key]
                return (
                    <Column
                        key={`prev-next-${key}-${JSON.stringify(props)}`}
                        small={12}
                        medium={6}
                        className={`prev-next__item prev-next__item--${key}`}
                    >
                        {item ? (
                            <Link href={item.link} className="prev-next__link">
                                <Icon />
                                <span className="prev-next__link__title">
                                    {item.title}
                                </span>
                            </Link>
                        ) : null}
                    </Column>
                )
            })}
        </Row>
    )
}
