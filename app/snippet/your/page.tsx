'use client'
/* CONSTANTS */
import Code from '@common/components/containers/Code'
import Table from '@common/components/containers/Table'
import { copyText } from '@common/utils/dom'
import Link from 'next/link'
import { useState } from 'react'

export default function Wrapper() {
    const [opened, setOpened] = useState(false)
    const shell = `# sudo docker exec -it <container> /bin/bash`
    const mongo = `aggregate([
    {
        $lookup: {
            from: "<foreign collection>",
            localField: "field",
            foreignField: "field",
            as: "field",
        },
    },
])`
    return (
        <Table fullWidth className="snippet">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Categories</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Link href="#" onClick={() => setOpened(!opened)}>
                            Docker exec
                        </Link>
                    </td>
                    <td className="center">Shell</td>
                </tr>
                <tr
                    className={`snippet__code__row ${
                        opened && 'snippet__code__row--open'
                    }`}
                >
                    <td colSpan={2}>
                        <div
                            className="snippet__code"
                            onClick={() => copyText(shell)}
                        >
                            <Code lang="shell">{shell}</Code>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Mongo aggregate::$lookup</td>
                    <td className="center">JS</td>
                </tr>
                <tr className="snippet__code__row">
                    <td colSpan={2} onClick={() => copyText(mongo)}>
                        <div className="snippet__code">
                            <Code lang="javascript">{mongo}</Code>
                        </div>
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}
