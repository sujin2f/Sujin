'use client'
import React, { useState, useCallback } from 'react'
import Link from 'next/link'
/* Components */
import { Input } from '@app/_components/html-elements/Input'
/* Utils */
import { copyText } from '@common/utils/dom'
import { capitalize } from '@common/utils/string'

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
const constantCase = (texts: string[]): string => texts.map((text) => text.toUpperCase()).join('_')

/*
 * dot.case
 */
const dotCase = (texts: string[]): string => texts.map((text) => text.toLowerCase()).join('.')

/*
 * param-case
 */
const paramCase = (texts: string[]): string => texts.map((text) => text.toLowerCase()).join('-')

/*
 * PascalCase
 */
const pascalCase = (texts: string[]): string => texts.map((text) => capitalize(text)).join('')

/*
 * path/case
 */
const pathCase = (texts: string[]): string => texts.map((text) => text.toLowerCase()).join('/')

/*
 * snake_case
 */
const snakeCase = (texts: string[]): string => texts.map((text) => text.toLowerCase()).join('_')

/*
 * Title Case
 */
const titleCase = (texts: string[]): string => texts.map((text) => capitalize(text)).join(' ')

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
        <>
            <label>
                <div className="text-bold">Keyword</div>
                <Input onChange={change} autoFocus />
                <p>Click result to copy to the clipboard.</p>
            </label>

            {textArr.length > 0 && (
                <dl className="grid grid-cols-1 gap-1 md:grid-cols-2">
                    {Object.keys(CASES)
                        .map((key) => [key, CASES[key](textArr)])
                        .map(([key, converted]) => (
                            <div key={`case-tool-${key}`}>
                                <dt>{key}</dt>
                                <dd>
                                    <Link onClick={() => copyText(converted)} href="#">
                                        <code data-lang="txt">{converted}</code>
                                    </Link>
                                </dd>
                            </div>
                        ))}
                </dl>
            )}
        </>
    )
}
