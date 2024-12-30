/*
 * Dev Tool / Text Sort Component
 * components/dev-tools/TextSort
 */

import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

import { getMaxCols, getRows, sortText } from 'src/frontend/utils/dev-tools'

const TextSort = (): JSX.Element => {
    const result = useRef<HTMLTextAreaElement>(null)
    const [text, changeText] = useState('')
    const [divider, setDivider] = useState<string>('')
    const [groupEnter, setGroupEnter] = useState(false)

    const handleChange = useCallback(
        (text: string, divider: string, groupEnter: boolean) => {
            changeText(text)
            setDivider(divider)
            setGroupEnter(groupEnter)

            if (result.current) {
                result.current.innerHTML = sortText(text, divider, groupEnter)
            }
        },
        [],
    )

    const rows = useMemo(() => Math.max(getRows(text), 10), [text])

    return (
        <Fragment>
            <Row>
                <Column>
                    <section className="input-group">
                        <span className="input-group-label">
                            Primary Sort after
                        </span>
                        <input
                            className="input-group-field"
                            type="text"
                            onChange={(e) =>
                                handleChange(text, e.target.value, groupEnter)
                            }
                        />
                    </section>
                    <label htmlFor="remove-empty">
                        <input
                            id="remove-empty"
                            type="checkbox"
                            onChange={(e) =>
                                handleChange(text, divider, e.target.checked)
                            }
                        />
                        Group divided by empty lines
                    </label>
                </Column>
            </Row>
            <Row>
                <Column small={6} className="text-sort__container">
                    <div className="text-sort__line-number">
                        {Array(rows)
                            .fill(0)
                            .map((n, index) => (
                                <div
                                    key={`text-sort__line-number--input-${index}`}
                                >
                                    {index + 1}
                                </div>
                            ))}
                    </div>
                    <div className="text-sort__section">
                        <textarea
                            className="text-sort__textarea"
                            onChange={(e) =>
                                handleChange(
                                    e.target.value,
                                    divider,
                                    groupEnter,
                                )
                            }
                            cols={getMaxCols(text)}
                            rows={rows}
                        />
                    </div>
                </Column>
                <Column small={6} className="text-sort__container">
                    <div className="text-sort__line-number">
                        {Array(rows)
                            .fill(0)
                            .map((n, index) => (
                                <div
                                    key={`text-sort__line-number--output-${index}`}
                                >
                                    {index + 1}
                                </div>
                            ))}
                    </div>
                    <div className="text-sort__section">
                        <textarea
                            className="text-sort__textarea"
                            disabled={true}
                            ref={result}
                            cols={getMaxCols(text)}
                            rows={rows}
                        ></textarea>
                    </div>
                </Column>
            </Row>
        </Fragment>
    )
}

export default TextSort
