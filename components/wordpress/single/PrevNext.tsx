import React from 'react'
import Link from 'next/link'
/* Components */
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Helpers */
import type { Post } from '@src/types/wordpress'
/* Assets */
import Prev from '@src/images/prev.svg'
import '@src/scss/prev-next.scss'

interface Props {
    prevNext?: {
        prev?: Post
        next?: Post
    }
}

export const PrevNext = (props: Props) => {
    if (!props.prevNext) {
        return <></>
    }

    const {
        prevNext: { prev, next },
    } = props
    return (
        <Row dom="nav" fullWidth className="prev-next__container">
            <Column small={12} medium={6} className="prev-next prev-next--prev">
                {prev && (
                    <Link href={prev.link} className="prev-next__link">
                        <Prev />
                        <span className="prev-next__link__title">
                            {prev.title}
                        </span>
                    </Link>
                )}
            </Column>
            <Column small={12} medium={6} className="prev-next prev-next--next">
                {next && (
                    <Link href={next.link} className="prev-next__link">
                        <Prev />
                        <span className="prev-next__link__title">
                            {next.title}
                        </span>
                    </Link>
                )}
            </Column>
        </Row>
    )
}
