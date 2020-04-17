/*
 * Dev Tool / Text Sort Component
 * components/dev-tools/TextSort
 */

import React, { Fragment, useState } from 'react';

import { Link }     from "components/common/Link";
import { sortText } from 'utils/dev-tools';

export const TextSort = (): JSX.Element => {
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const convertedText = text ? sortText(text, checked) : (<Fragment />);

  const handleChangeText = (event): never => {
    setText(event.target.value);
  }

  const handleChangeChecked = (event): never => {
    setChecked(event.target.checked);
  }

  return (
    <Fragment>
      <aside className="columns large-3 medium-12">
        <ul>
          <li>
            <Link to="/dev-tools" rel="noopener noreferrer">
              Case Tool
            </Link>
          </li>
          <li>
            <Link to="/text-sort" rel="noopener noreferrer">
              Text Sort
            </Link>
          </li>
          <li>
            <Link to="/symbol-alignment" rel="noopener noreferrer">
              Symbol Alignment
            </Link>
          </li>
        </ul>
      </aside>

      <article className="columns large-9 medium-12">
        <label htmlFor="remove-empty">
          <input
            id="remove-empty"
            type="checkbox"
            onChange={handleChangeChecked}
            checked={checked}
          />
          Remove Empty Lines
        </label>
        <textarea id="sort-text" onChange={handleChangeText} rows={10} />

        <pre>
          {convertedText}
        </pre>
      </article>
    </Fragment>
  );
};
