import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Row } from 'src/common/components/layout/Row'
import { Column } from 'src/common/components/layout/Column'
import { Post } from 'src/types/wordpress'
import Prev from 'src/frontend/images/prev.svg'

require('src/frontend/scss/prev-next.scss')

interface Props {
    prevNext?: {
        prev?: Post
        next?: Post
    }
}

export const PrevNext = (props: Props): JSX.Element => {
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
                    to={prev.link}
                    className="prev-next prev-next--prev"
                >
                    <Prev />
                    {prev.title}
                </Column>
            )}
            {next && (
                <Column
                    dom={Link}
                    small={12}
                    medium={6}
                    to={next.link}
                    className="prev-next prev-next--next"
                >
                    <Prev />
                    {next.title}
                </Column>
            )}
        </Row>
    )
}
