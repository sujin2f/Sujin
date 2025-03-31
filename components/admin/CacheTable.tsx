'use client'
import { Table } from '@common/components/containers/Table'
import Link from 'next/link'

type Props = {
    caches: string[]
    removeCache: (key: string) => Promise<void>
}

export default function CacheTable(props: Props) {
    return (
        <article>
            <Table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {props.caches.map((cache) => (
                        <tr key={`admin-cache-${cache}`}>
                            <td>{cache}</td>
                            <td>
                                <Link
                                    href="#"
                                    onClick={() => props.removeCache(cache)}
                                >
                                    Remove
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </article>
    )
}
