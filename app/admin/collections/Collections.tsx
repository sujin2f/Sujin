'use client'
import Link from 'next/link'
/* Components */
import { Table } from '@common/components/containers/Table'

type Props = {
    collections: {
        name: string
        key: string
    }[]
    drop: (collection: string) => Promise<void>
}

export default function Collections(props: Props) {
    return (
        <>
            <h2>DB collections</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Collection</th>
                        <th>Drop</th>
                    </tr>
                </thead>
                <tbody>
                    {props.collections.map((collection) => (
                        <tr key={`admin-index-${collection.name}`}>
                            <td>{collection.name}</td>
                            <td>
                                <Link
                                    href="#"
                                    onClick={() => props.drop(collection.name)}
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
