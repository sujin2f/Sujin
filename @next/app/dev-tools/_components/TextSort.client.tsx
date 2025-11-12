'use client'
import React, { useState, useMemo, type ChangeEvent } from 'react'
/* Components */
import Input from '@sujin/common/components/forms/Input'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
/* Helpers */
import { map } from '@sujin/common/utils/array'

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

const getMaxCols = (text: string): number => {
    return Math.max(...text.split('\n').map((line) => line.length))
}

const getRows = (text: string): number => {
    return text.split('\n').length
}

const sortText = (
    text: string,
    primaryText: string,
    groupByEmpty: boolean,
): string => {
    if (groupByEmpty) {
        return text
            .split('\n\n')
            .filter((l) => l)
            .map((block) => sortTextWithPrimary(block, primaryText))
            .join('\n\n')
    }
    return sortTextWithPrimary(text, primaryText)
}

const sortTextWithPrimary = (text: string, primaryText: string) => {
    if (!primaryText) {
        return sortTextBlock(text)
    }

    const keys: string[] = []
    const empty: string[] = []
    const group: Record<string, string[]> = {}
    text.split('\n')
        .filter((l) => l)
        .forEach((line) => {
            const splitted = line.split(primaryText)
            const key = splitted[1]
            if (!key) {
                empty.push(line)
                return
            }

            if (!group[key]) {
                keys.push(key)
                group[key] = []
            }
            group[key].push(line)
        })

    const result: string[] = []
    if (empty.length) {
        result.push(sortTextBlock(empty.join('\n')))
    }
    keys.sort().forEach((key) => {
        result.push(sortTextBlock(group[key].join('\n')))
    })
    return result.join('\n')
}

const sortTextBlock = (text: string) =>
    text
        .split('\n')
        .filter((l) => l)
        .sort()
        .join('\n')
