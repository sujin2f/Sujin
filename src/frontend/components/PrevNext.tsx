import React, { Fragment } from 'react'

import { Link } from 'src/frontend/components'
import { Post } from 'src/types'

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

    const prevNext = props.prevNext as { [key: string]: Post }

    return (
        <nav className="prev-next">
            {Object.keys(prevNext).map((key) => {
                if (!prevNext[key]) {
                    return null
                }

                return (
                    <Link
                        to={prevNext[key].link}
                        className={key}
                        key={`prev-next__${prevNext[key].id}`}
                    >
                        <i />
                        <Fragment>{prevNext[key].title}</Fragment>
                    </Link>
                )
            })}
        </nav>
    )
}
