import React, { useState, useCallback, Fragment } from 'react'

import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { copyText } from 'src/common/utils/device'

import {
    preserveCase,
    camelCase,
    pascalCase,
    paramCase,
    snakeCase,
    constantCase,
    titleCase,
    pathCase,
    dotCase,
} from 'src/frontend/utils/dev-tools'

const CASES: Record<string, (text: string[]) => string> = {
    camelCase: camelCase,
    PascalCase: pascalCase,
    'param-case': paramCase,
    snake_case: snakeCase,
    CONSTANT_CASE: constantCase,
    'Title Case': titleCase,
    'dot.case': dotCase,
    'path/case': pathCase,
}

export const CaseTool = (): JSX.Element => {
    const [textArr, setTextArr] = useState<string[]>([])

    const change = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTextArr(preserveCase(event.target.value))
    }, [])

    return (
        <Fragment>
            <p className="description">Convert keyword into many cases.</p>

            <section className="input-group">
                <span className="input-group-label">Keyword</span>
                <input
                    id="convert-keyword"
                    className="input-group-field"
                    type="text"
                    onChange={change}
                />
            </section>
            <p className="help-text">Click result to copy to the clipboard.</p>

            {textArr.length > 0 && (
                <Row dom="dl">
                    {Object.keys(CASES).map((key) => {
                        const converted = CASES[key](textArr)
                        return (
                            <Column
                                large={6}
                                medium={12}
                                key={`case-tool-${key}`}
                            >
                                <dt>
                                    <span className="label">{key}</span>
                                </dt>
                                <dd className="lead">
                                    <code
                                        onClick={() => copyText(converted)}
                                        className="cursor--copy"
                                    >
                                        {converted}
                                    </code>
                                </dd>
                            </Column>
                        )
                    })}
                </Row>
            )}
        </Fragment>
    )
}
