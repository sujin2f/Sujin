'use client'

import React, { useMemo, useState } from 'react'

import { Input } from '@common/components/forms/Input'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { map } from '@common/utils/array'
import { getMaxCols, getRows, sortText } from '@src/utils/dev-tools'

export function TextSort() {
    const [text, setText] = useState('')
    const [divider, setDivider] = useState<string>('')
    const [groupEnter, setGroupEnter] = useState(false)

    const rows = useMemo(() => Math.max(getRows(text), 10), [text])
    const converted = useMemo(
        () => sortText(text, divider, groupEnter),
        [divider, groupEnter, text],
    )
    return (
        <>
            <Input
                label="Primary Sort after"
                onChange={(e) => setDivider(e.target.value)}
                type="text"
            />

            <Input
                label="Group divided by empty lines"
                onChange={(e) => setGroupEnter(e.target.checked)}
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
        </>
    )
}
