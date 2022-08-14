/*
 * Dev Tool / Symbol Alignment Component
 * components/dev-tools/CaseTool
 */

import React, { Fragment, useState } from 'react'

import { Link } from 'src/frontend/components/Link'
import { symbolAlignment } from 'src/frontend/utils/dev-tools'

export const SymbolAlignment = (): JSX.Element => {
    const [symbol, setSymbol] = useState('=')
    const [text, setText] = useState('')
    const convertedText = text ? symbolAlignment(text, symbol) : <Fragment />

    const handleChangeText = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ): void => {
        setText(event.target.value)
    }

    const handleChangeSymbol = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setSymbol(event.target.value)
    }

    return (
        <Fragment>
            <aside>
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

            <article>
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
                <textarea
                    id="sort-text"
                    onChange={handleChangeText}
                    rows={10}
                />

                <pre>{convertedText}</pre>
            </article>
        </Fragment>
    )
}
