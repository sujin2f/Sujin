'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Components */
import Table from '@common/components/containers/Table'
import Header from '@app/admin/_components/Header'

type Props = {
    collections: {
        name: string
        key: string
    }[]
    drop: (collection: string) => Promise<void>
    totalSize: number
}

export function CollectionsClient({ collections, totalSize, drop }: Props) {
    const router = useRouter()
    return (
        <>
            <Header
                title={`DB collections (${(totalSize / Math.pow(2, 20)).toFixed(
                    2,
                )}Mb)`}
            />
            <Table>
                <thead>
                    <tr>
                        <th>Collection</th>
                        <th>Drop</th>
                    </tr>
                </thead>
                <tbody>
                    {collections.map((collection) => (
                        <tr key={`admin-index-${collection.name}`}>
                            <td>{collection.name}</td>
                            <td>
                                <Link
                                    href="#"
                                    onClick={() =>
                                        drop(collection.name).then(() => {
                                            router.refresh()
                                        })
                                    }
                                >
                                    Drop
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
