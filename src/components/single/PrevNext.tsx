/*
 * PrevNext Component
 * components/single/PrevNext
 */

import React from 'react';

import { Link }        from "components/common/Link";
import { ISimplePost } from 'store/items/interface/simple-post';

interface Props {
  prevNext: {
    [key: string]: ISimplePost;
  };
}

export const PrevNext = (props: Props): JSX.Element => {
  return (
    <nav className="prev-next">
      {Object.keys(props.prevNext).map((key) => {
        if (!props.prevNext[key]) {
          return null;
        }

        return (
          <Link
            to={props.prevNext[key].link}
            className={key}
            key={`prev-next__${props.prevNext[key].id}`}
          >
            <i />
            {props.prevNext[key].title}
          </Link>
        );
      })}
    </nav>
  );
};
