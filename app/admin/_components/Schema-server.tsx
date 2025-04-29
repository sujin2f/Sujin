import Table from '@common/components/containers/Table'
import { COLLECTION } from '@app/_lib/types'
import Header from '@app/admin/_components/Header'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { getSchema } from '@app/admin/_lib/getSchema'
import { A_Error, NoContentError } from '@common/model/Error'
import { getCachedOption } from '@app/admin/_lib/options'

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
