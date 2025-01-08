import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Post } from '@project/types/wordpress'
import Prev from '@frontend/images/prev.svg'

import 'src/frontend/scss/prev-next.scss'

interface Props {
    prevNext?: {
        prev?: Post
        next?: Post
    }
}

export const PrevNext = (props: Props) => {
    if (!props.prevNext) {
        return <Fragment />
    }

    const {
        prevNext: { prev, next },
    } = props
    return (
        <Row dom="nav" fullWidth className="prev-next__container">
            <Column small={12} medium={6} className="prev-next prev-next--prev">
                {prev && (
                    <Link to={prev.link} className="prev-next__link">
                        <Prev />
                        <span className="prev-next__link__title">
                            {prev.title}
                        </span>
                    </Link>
                )}
            </Column>
            <Column small={12} medium={6} className="prev-next prev-next--next">
                {next && (
                    <Link to={next.link} className="prev-next__link">
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
