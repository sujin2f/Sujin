import { Table } from '@common/components/containers/Table'
import { COLLECTION } from '@app/_lib/types'
import Header from '@app/admin/_components/Header'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { getIndexes, getCachedOption } from '@app/_lib/data/mongo/admin'

export default async function ResetIndex() {
    const indexes = await getIndexes(
        COLLECTION.BACKGROUNDS,
        COLLECTION.CATEGORY,
        COLLECTION.TAG,
        COLLECTION.PAGE,
        COLLECTION.POST,
        COLLECTION.OPTIONS,
        COLLECTION.SPECTRA,
        COLLECTION.USERS,
    )
    const version = await getCachedOption('version')

    return (
        <>
            <Header title={`DB Index: ${version}`} />
            <Row>
                {Object.entries(indexes).map(([collection, data]) => (
                    <Column gap key={`admin-index-${collection}`}>
                        <h2>{collection}</h2>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Key</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data).map(([key, value]) => (
                                    <tr
                                        key={`admin-index-${collection}-${key}`}
                                    >
                                        <td>{key}</td>
                                        <td>{JSON.stringify(value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Column>
                ))}
            </Row>
        </>
    )
}
