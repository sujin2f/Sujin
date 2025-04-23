'use client'
import React, { useState, useMemo, type ChangeEvent } from 'react'
/* Components */
import Input from '@common/components/forms/Input'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* Helpers */
import { map } from '@common/utils/array'
import { getMaxCols, getRows, sortText } from '@app/dev-tools/utils'

export function TextSortClient() {
    const [text, setText] = useState('')
    const [divider, setDivider] = useState<string>('')
    const [groupEnter, setGroupEnter] = useState(false)

    const rows = useMemo(() => Math.max(getRows(text), 10), [text])
    const converted = useMemo(
        () => sortText(text, divider, groupEnter),
        [divider, groupEnter, text],
    )

    return (
        <article className="text-sort">
            <Input
                label="Primary Sort after"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDivider(e.target.value)
                }
                type="text"
            />

            <Input
                label="Group divided by empty lines"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setGroupEnter(e.target.checked)
                }
                type="checkbox"
            />

            <Row fullWidth>
                <Column className="text-sort__container" small={6}>
                    <div className="text-sort__line-number">
                        {map(rows, (_, index) => (
                            <div key={`text-sort__line-number--input-${index}`}>
                                {index + 1}
                            </div>
                        ))}
                    </div>

                    <div className="text-sort__section">
                        <textarea
                            className="text-sort__textarea"
                            cols={getMaxCols(text)}
                            onChange={(e) => setText(e.target.value)}
                            rows={rows}
                        />
                    </div>
                </Column>

                <Column className="text-sort__container" small={6}>
                    <div className="text-sort__line-number">
                        {map(rows, (_, index) => (
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
                            cols={getMaxCols(text)}
                            disabled
                            rows={rows}
                            value={converted}
                        ></textarea>
                    </div>
                </Column>
            </Row>
        </article>
    )
}
