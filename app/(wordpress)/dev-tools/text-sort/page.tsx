'use client'

import React, { useEffect, useState, useMemo } from 'react'

import { Input } from '@common/components/forms/Input'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { MenuNames } from '@src/constants/mysql-query'
import { setBanner, setMenu, setWrapperClass } from '@src/store/actions'
import { useContext } from '@src/store'
import { map } from '@common/utils/array'
import { getMaxCols, getRows, sortText } from '@src/utils/dev-tools'

import '@src/scss/dev-tool.scss'

export default function TextSort() {
    const [, dispatch] = useContext()

    const [text, setText] = useState('')
    const [divider, setDivider] = useState<string>('')
    const [groupEnter, setGroupEnter] = useState(false)

    const rows = useMemo(() => Math.max(getRows(text), 10), [text])
    const converted = useMemo(
        () => sortText(text, divider, groupEnter),
        [divider, groupEnter, text],
    )

    useEffect(() => {
        dispatch(setMenu(MenuNames.DEV_TOOL))
        dispatch(setWrapperClass(''))
        dispatch(
            setBanner({
                title: 'Text Sort',
                excerpt: '',
                icon: undefined,
                prefix: undefined,
                background: undefined,
                backgroundColor: undefined,
            }),
        )
    }, [dispatch])

    return (
        <Row className="text-sort">
            <Column dom="article" small={12}>
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
            </Column>
        </Row>
    )
}
