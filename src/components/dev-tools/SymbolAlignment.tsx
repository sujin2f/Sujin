/*
 * Dev Tool / Symbol Alignment Component
 * components/dev-tools/CaseTool
 */

import React, { Fragment, useState } from 'react';

import { Link } from "components/common/Link";
import { symbolAlignment } from 'utils/dev-tools';

export const SymbolAlignment = (): JSX.Element => {
  const [symbol, setSymbol] = useState('=');
  const [text, setText] = useState('');
  const convertedText = text ? symbolAlignment(text, symbol) : (<Fragment />);

  const handleChangeText = (event): never => {
    setText(event.target.value);
  }

  const handleChangeSymbol = (event): never => {
    setSymbol(event.target.value);
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
        <section className="input-group">
          <span className="input-group-label">Symbol</span>
          <input
            id="convert-keyword"
            className="input-group-field"
            type="text"
            onChange={handleChangeSymbol}
            value={symbol}
          />
        </section>
        <textarea id="sort-text" onChange={handleChangeText} rows={10} />

        <pre>
          {convertedText}
        </pre>
      </article>
    </Fragment>
  );
};
