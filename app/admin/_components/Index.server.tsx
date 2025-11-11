import type { IndexDescriptionCompact } from 'mongodb'
/* Components */
import Table from '@sujin/common/components/containers/Table'
import Header from '@app/admin/_components/Header'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
/* Models */
import {
    UnauthorizedError,
    A_Error,
    NoContentError,
} from '@sujin/common/model/Error'
/* Utils */
import { isAdmin } from '@app/api/auth/_lib/utils-server'
import { getCachedOption } from '@app/_lib/utils/mongo/options'
/* T_Types */
import { getCollection } from '@sujin/common/data/mongo/mongo'
/* CONSTANTS */
import { COLLECTION } from '@app/_lib/types'

export async function IndexServer() {
    const indexes = await getIndexes(...Object.values(COLLECTION))
    const version = await getCachedOption('version').catch((e) => {
        if (e instanceof A_Error) {
            new NoContentError('Cannot find version from MongoDB').log()
        } else {
            console.error(e)
        }
        return '0.0.0'
    })

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

const getIndexes = async (...collections: string[]) => {
    if (!(await isAdmin())) throw new UnauthorizedError()
    const indexes: Record<string, IndexDescriptionCompact> = {}
    for (const name of collections) {
        const collection = await getCollection(name)
        const index = await collection
            .indexInformation()
            .catch((e) => console.log(name, e))
        if (index) {
            indexes[name] = index
        }
    }
    return indexes
}
