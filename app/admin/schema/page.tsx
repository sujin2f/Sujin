import { Table } from '@common/components/containers/Table'
import { COLLECTION } from '@src/constants/mongo'
import { getSchema } from '@src/db/mongo/admin/getIndexes'
import getSystemOption from '@src/db/mongo/admin/getSystemOption'

export default async function ResetIndex() {
    const indexes = await getSchema(
        COLLECTION.BACKGROUNDS,
        COLLECTION.CATEGORY,
        COLLECTION.TAG,
        COLLECTION.POST,
        COLLECTION.PAGE,
        COLLECTION.OPTIONS,
        COLLECTION.SPECTRA,
        COLLECTION.USERS,
    )
    const version = await getSystemOption('version')

    return (
        <>
            <h2>DB Index: {version}</h2>
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
        </>
    )
}
