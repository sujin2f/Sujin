'use client'
import React from 'react'
import Link from 'next/link'
/* Components */
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Types */
import type { TPrevNext } from '@app/_lib/data/mysql/types'
/* Assets */
import Icon from '@app/_lib/images/prev.svg'
import './style.scss'

type Props = {
    readonly prev?: TPrevNext | false
    readonly next?: TPrevNext | false
}

export const PrevNext = (props: Props) => {
    return (
        <Row dom="nav" fullWidth className="prev-next__container">
            {Object.keys(props)
                .filter((v) => v)
                .map((index) => {
                    const key = index as 'prev' | 'next'
                    const item = props[key]
                    if (!item) return <></>

                    return (
                        <Column
                            key={`prev-next-${item.link}`}
                            small={12}
                            medium={6}
                            className={`prev-next prev-next--${key}`}
                        >
                            <Link href={item.link} className="prev-next__link">
                                <Icon />
                                <span className="prev-next__link__title">
                                    {item.title}
                                </span>
                            </Link>
                        </Column>
                    )
                })}
        </Row>
    )
}
