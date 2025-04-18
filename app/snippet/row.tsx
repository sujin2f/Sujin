'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { T_Snippets } from '@app/_lib/types'
/* CONSTANTS */
import Code from '@common/components/containers/Code'
import { copyText } from '@common/utils/dom'

type Props = {
    readonly snippet: T_Snippets
}

export default function Row({ snippet: { title, tags, snippets } }: Props) {
    const [opened, setOpened] = useState(false)
    return (
        <>
            <tr>
                <td>
                    <Link href="#" onClick={() => setOpened(!opened)}>
                        {title}
                    </Link>
                </td>
                <td className="center">{tags && tags.length && tags}</td>
            </tr>
            <tr
                className={`snippet__code__row ${
                    opened && 'snippet__code__row--open'
                }`}
            >
                <td colSpan={2}>
                    {snippets.map(({ code, type }, index) => (
                        <div
                            key={`snippet__code__${index}`}
                            className="snippet__code"
                            onClick={() => copyText(code)}
                        >
                            <Code lang={type}>{code}</Code>
                        </div>
                    ))}
                </td>
            </tr>
        </>
    )
}
