import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Row } from 'src/common/components/layout/Row'
import { Column } from 'src/common/components/layout/Column'
import { Post } from 'src/types/wordpress'
import Prev from 'src/frontend/images/prev.svg'

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
            {prev && (
                <Column
                    dom={Link}
                    small={12}
                    medium={6}
                    className="prev-next prev-next--prev"
                >
                    <Link to={prev.link}>
                        <Prev />
                        {prev.title}
                    </Link>
                </Column>
            )}
            {next && (
                <Column
                    dom={Link}
                    small={12}
                    medium={6}
                    className="prev-next prev-next--next"
                >
                    <Link to={next.link}>
                        <Prev />
                        {next.title}
                    </Link>
                </Column>
            )}
        </Row>
    )
}
