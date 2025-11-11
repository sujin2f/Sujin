import type { Document } from 'mongodb'
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

export async function SchemaServer() {
    const indexes = await getSchema(...Object.values(COLLECTION))
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
            <Header title={`Schema: ${version}`} />
            <Row>
                {Object.entries(indexes).map(([collection, data]) => (
                    <Column small={12} key={`admin-index-${collection}`}>
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

const getSchema = async (...collections: string[]) => {
    if (!(await isAdmin())) throw new UnauthorizedError()
    const schema: Record<string, Document> = {}

    for (const name of collections) {
        const collection = await getCollection(name)
        const info = await collection
            .options()
            .then((schema) => {
                const { validator } = schema
                if (validator) {
                    return validator.$jsonSchema
                }
                return {}
            })
            .catch((e) => console.log(collection, e))

        if (info) {
            schema[name] = info
        }
    }

    return schema
}
