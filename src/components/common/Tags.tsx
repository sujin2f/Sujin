/*
 * Tags Component
 * components/common/Tags
 */

import React from 'react';

import { Link } from "components/common/Link";

export const Tags = (props): JSX.Element => {
  const tags = props.tags || {};
  return (
    <ul className="tags">
      {Object.keys(tags).map((index) => (
        <li key={`tag-id-${tags[index].slug}-${props.from}`}>
          <Link to={`/tag/${tags[index].slug}/page/1`}>
            {tags[index].name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
