/*
 * Tags Component
 * components/common/Tags
 */

import React from 'react'

import { Link } from 'components/common/Link'
import { Term } from 'store/items/term'

interface Props {
  items?: Term[]
  prefix: string
}

export const Tags = (props: Props): JSX.Element => {
  return (
    <ul className="tags">
      {props.items && props.items.map((tag: Term) => (
        <li key={`tag-${props.prefix}-${tag.slug}`}>
          <Link to={`/tag/${tag.slug}/page/1`}>
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
