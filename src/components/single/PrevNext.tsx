/*
 * PrevNext Component
 * components/single/PrevNext
 */

import React, { Fragment} from 'react'

import { Link } from 'components/common/Link'
import { SimplePost } from 'store/items/simple-post'

interface Props {
  prevNext?: {
    prev?: SimplePost
    next?: SimplePost
  }
}

type keys = Props['prevNext']

export const PrevNext = (props: Props): JSX.Element => {
  if (!props.prevNext) {
    return <Fragment />
  }

  const prevNext = props.prevNext as { [key: string]: SimplePost }

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
