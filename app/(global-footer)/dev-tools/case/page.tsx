'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'

import { Input } from '@common/components/forms/Input'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { copyText } from '@common/utils/device'
import { ScrollToTop } from '@components/ScrollToTop'

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
} from '@src/utils/dev-tools'

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

import '@src/scss/dev-tool.scss'

export default function CaseTool() {
    const [textArr, setTextArr] = useState<string[]>([])

    const change = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTextArr(preserveCase(event.target.value))
    }, [])

    return (
        <Row className="case-tool">
            <ScrollToTop />
            <Column dom="article" small={12}>
                <Input
                    helpText="Click result to copy to the clipboard."
                    id="convert-keyword"
                    label="Keyword"
                    onChange={change}
                    type="text"
                />

                {textArr.length > 0 && (
                    <Row className="case-tool__result" dom="dl" fullWidth>
                        {Object.keys(CASES).map((key) => {
                            const converted = CASES[key](textArr)

                            return (
                                <Column
                                    key={`case-tool-${key}`}
                                    large={6}
                                    medium={12}
                                >
                                    <dt>{key}</dt>

                                    <dd className="lead">
                                        <Link
                                            onClick={() => copyText(converted)}
                                            href="#"
                                        >
                                            <code data-lang="txt">
                                                {converted}
                                            </code>
                                        </Link>
                                    </dd>
                                </Column>
                            )
                        })}
                    </Row>
                )}
            </Column>
        </Row>
    )
}
