import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'

import { Banner } from '@frontend/scenes/layout/Banner'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Input } from '@common/components/forms/Input'
import { SideMenu } from '@frontend/scenes/devtool/SideMenu'
import { getMaxCols, getRows, sortText } from '@frontend/utils/dev-tools'

function TextSort() {
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
            <Banner title="Text Sort" />

            <Row>
                <Column dom="aside" large={3} small={12}>
                    <SideMenu />
                </Column>

                <Column dom="article" large={9} small={12}>
                    <Input
                        label="Primary Sort after"
                        onChange={(e) =>
                            handleChange(text, e.target.value, groupEnter)
                        }
                        type="text"
                    />

                    <Input
                        label="Group divided by empty lines"
                        onChange={(e) =>
                            handleChange(text, divider, e.target.checked)
                        }
                        type="checkbox"
                    />

                    <Row fullWidth>
                        <Column className="text-sort__container" small={6}>
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
                                    cols={getMaxCols(text)}
                                    onChange={(e) =>
                                        handleChange(
                                            e.target.value,
                                            divider,
                                            groupEnter,
                                        )
                                    }
                                    rows={rows}
                                />
                            </div>
                        </Column>

                        <Column className="text-sort__container" small={6}>
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
                                    cols={getMaxCols(text)}
                                    disabled
                                    ref={result}
                                    rows={rows}
                                />
                            </div>
                        </Column>
                    </Row>
                </Column>
            </Row>
        </Fragment>
    )
}

export default TextSort
