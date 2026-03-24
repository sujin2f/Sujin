'use client'
import { useState, useMemo, type ChangeEvent } from 'react'
/* Utils */
import { map } from '@common/utils/array'
/* Components */
import { Input } from '@app/_components/html-elements/Input'

export const dynamic = 'force-dynamic'

export default function TextSort() {
    const [text, setText] = useState('')
    const [divider, setDivider] = useState<string>('')
    const [groupEnter, setGroupEnter] = useState(false)

    const rows = useMemo(() => Math.max(getRows(text), 10), [text])
    const converted = useMemo(() => sortText(text, divider, groupEnter), [divider, groupEnter, text])

    return (
        <>
            <label className="block mb-2">
                <div>Primary Sort after</div>
                <Input
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDivider(e.target.value)}
                    type="text"
                    autoFocus
                />
            </label>

            <label className="block mb-2">
                <span className="mr-3">Group divided by empty lines</span>
                <input
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setGroupEnter(e.target.checked)}
                    type="checkbox"
                />
            </label>

            {/* TODO convert to table */}
            <section
                aria-label="text input"
                className="grid grid-cols-[fit-content(20px)_1fr] gap-2 border border-slate-300"
            >
                <div className="bg-slate-100 px-2">
                    {map(rows, (_, index) => (
                        <div key={`text-sort__line-number--input-${index}`} className="text-right">
                            {index + 1}
                        </div>
                    ))}
                </div>

                <div className="">
                    <textarea
                        className="w-full outline-0"
                        cols={getMaxCols(text)}
                        onChange={(e) => setText(e.target.value)}
                        rows={rows}
                    />
                </div>
            </section>

            <div className="text-center">⬇️</div>

            <section
                aria-label="text input"
                className="grid grid-cols-[fit-content(20px)_1fr] gap-2 border border-slate-300"
            >
                <div className="bg-slate-100 px-2">
                    {map(rows, (_, index) => (
                        <div key={`text-sort__line-number--output-${index}`} className="text-right">
                            {index + 1}
                        </div>
                    ))}
                </div>

                <div className="">
                    <textarea
                        className="w-full outline-0"
                        cols={getMaxCols(text)}
                        disabled
                        rows={rows}
                        value={converted}
                    />
                </div>
            </section>
        </>
    )
}

const getMaxCols = (text: string): number => {
    return Math.max(...text.split('\n').map((line) => line.length))
}

const getRows = (text: string): number => {
    return text.split('\n').length
}

const sortText = (text: string, primaryText: string, groupByEmpty: boolean): string => {
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
