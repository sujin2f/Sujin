import Cached from '@common/model/Cached'
import { Table } from '@common/components/containers/Table'
import Link from 'next/link'

export default async function Cache() {
    const caches = await Cached.getInstance().list()
    const removeCache = async (key: string) => {
        'use server'
        Cached.getInstance().flush(key)
    }

    return (
        <>
            <h2>Cache</h2>
            <article>
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
                                        onClick={() => removeCache(cache)}
                                    >
                                        Remove
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </article>
        </>
    )
}
