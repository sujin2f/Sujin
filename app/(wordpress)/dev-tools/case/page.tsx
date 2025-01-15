'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

import { Input } from '@common/components/forms/Input'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { copyText } from '@common/utils/device'
import { MenuNames } from '@src/constants/mysql-query'
import { setBanner, setMenu, setWrapperClass } from '@src/store/actions'
import { useContext } from '@src/store'

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
    const [, dispatch] = useContext()
    const [textArr, setTextArr] = useState<string[]>([])

    const change = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTextArr(preserveCase(event.target.value))
    }, [])

    useEffect(() => {
        dispatch(setMenu(MenuNames.DEV_TOOL))
        dispatch(setWrapperClass(''))
        dispatch(
            setBanner({
                title: 'Case Tool',
                excerpt: 'Convert a string into many cases.',
                icon: undefined,
                prefix: undefined,
                background: undefined,
                backgroundColor: undefined,
            }),
        )
    }, [dispatch])

    return (
        <Row className="case-tool">
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
