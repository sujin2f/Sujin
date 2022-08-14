/*
 * Dev Tool / Text Sort Component
 * components/dev-tools/TextSort
 */

import React, { Fragment, useState } from 'react'

import { Link } from 'src/frontend/components/Link'
import { sortText } from 'src/frontend/utils/dev-tools'

export const TextSort = (): JSX.Element => {
    const [text, setText] = useState('')
    const [checked, setChecked] = useState(false)
    const convertedText = text ? sortText(text, checked) : <Fragment />

    const handleChangeText = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ): void => {
        setText(event.target.value)
    }

    const handleChangeChecked = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setChecked(event.target.checked)
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
                <label htmlFor="remove-empty">
                    <input
                        id="remove-empty"
                        type="checkbox"
                        onChange={handleChangeChecked}
                        checked={checked}
                    />
                    Remove Empty Lines
                </label>
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
