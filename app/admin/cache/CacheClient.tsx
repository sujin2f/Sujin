'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Components */
import { Button } from '@common/components/forms/Button'
import { Table } from '@common/components/containers/Table'
import Header from '@app/admin/_components/Header'

type Props = {
    removeCache: (key?: string) => Promise<void>
    caches: string[]
}

export function CacheClient({ removeCache, caches }: Props) {
    const router = useRouter()

    return (
        <>
            <Header title="Cache">
                <Button
                    title="Remove All"
                    onClick={() =>
                        removeCache().then(() => {
                            router.refresh()
                        })
                    }
                />
            </Header>
            <Table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {caches.map((cache) => (
                        <tr key={`admin-cache-${cache}`}>
                            <td>{cache}</td>
                            <td>
                                <Link
                                    href="#"
                                    onClick={() =>
                                        removeCache(cache).then(() => {
                                            router.refresh()
                                        })
                                    }
                                >
                                    Remove
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
