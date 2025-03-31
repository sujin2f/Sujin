import Link from 'next/link'
import { Table } from '@common/components/containers/Table'
import getIndexes from '@src/db/mongo/admin/getIndexes'

export default async function ResetIndex() {
    const indexes = await getIndexes(
        'post',
        'spectra',
        'term',
        'options',
        'user',
    )

    return (
        <>
            {Object.entries(indexes).map(([collection, data]) => (
                <article key={`admin-index-${collection}`}>
                    <h3>{collection}</h3>

                    <Table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data).map(([key, value]) => (
                                <tr key={`admin-index-${collection}-${key}`}>
                                    <td>{key}</td>
                                    <td>{JSON.stringify(value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </article>
            ))}
            <Link href="/admin/reset-index">Reset Index</Link>
        </>
    )
}
