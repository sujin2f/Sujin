'use client'
import React, { useState, useCallback } from 'react'
import Link from 'next/link'
/* Components */
import Input from '@common/components/forms/Input'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
/* Helpers */
import { copyText } from '@sujin/share/utils/dom'
import { capitalize } from '@sujin/share/utils/string'

/*
 * String to array word by word
 */
const preserveCase = (input: string): string[] => {
    let output = ''
    let lastChar = ''

    Array.from(Array(input.length).keys()).forEach((i) => {
        const c = input[i]

        if (/[a-z0-9]/.test(c)) {
            output += c.toLowerCase()
        } else if (/[A-Z]/.test(c)) {
            if (/[A-Z]/.test(lastChar)) {
                output += c.toLowerCase()
            } else {
                output += `-${c.toLowerCase()}`
            }
        } else {
            output += '-'
        }

        lastChar = c
    })

    return output.split('-').filter((c) => c)
}

/*
 * camelCase
 */
const camelCase = (texts: string[]): string => {
    const output = texts.map((text) => capitalize(text))
    output[0] = output[0].toLowerCase()
    return output.join('')
}

/*
 * CONSTANT_CASE
 */
const constantCase = (texts: string[]): string =>
    texts.map((text) => text.toUpperCase()).join('_')

/*
 * dot.case
 */
const dotCase = (texts: string[]): string =>
    texts.map((text) => text.toLowerCase()).join('.')

/*
 * param-case
 */
const paramCase = (texts: string[]): string =>
    texts.map((text) => text.toLowerCase()).join('-')

/*
 * PascalCase
 */
const pascalCase = (texts: string[]): string =>
    texts.map((text) => capitalize(text)).join('')

/*
 * path/case
 */
const pathCase = (texts: string[]): string =>
    texts.map((text) => text.toLowerCase()).join('/')

/*
 * snake_case
 */
const snakeCase = (texts: string[]): string =>
    texts.map((text) => text.toLowerCase()).join('_')

/*
 * Title Case
 */
const titleCase = (texts: string[]): string =>
    texts.map((text) => capitalize(text)).join(' ')

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

export default function CaseTool() {
    const [textArr, setTextArr] = useState<string[]>([])

    const change = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTextArr(preserveCase(event.target.value))
    }, [])

    return (
        <article className="case-tool">
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
                                        <code data-lang="txt">{converted}</code>
                                    </Link>
                                </dd>
                            </Column>
                        )
                    })}
                </Row>
            )}
        </article>
    )
}
