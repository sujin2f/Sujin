import React, { Fragment } from 'react'

import { Link } from 'src/frontend/components/Link'
import { Post } from 'src/types/wordpress'

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
        <nav className="prev-next">
            {prev && (
                <Link to={prev.link} className="prev-next__prev">
                    <i />
                    {prev.title}
                </Link>
            )}
            {next && (
                <Link to={next.link} className="prev-next__next">
                    <i />
                    {next.title}
                </Link>
            )}
        </nav>
    )
}
