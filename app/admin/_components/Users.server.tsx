/* Components */
import { PrevNext } from '@app/admin/_components/PrevNext'
import Table from '@common/components/containers/Table'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Header from '@app/admin/_components/Header'
import { COLLECTION, T_User } from '@app/_lib/types'
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { decodeText } from '@app/_lib/utils/crypto'

type Props = {
    page: number
}

export async function UsersServer({ page }: Props) {
    const users = await getUsers(page)

    return (
        <>
            <Header title="Users" />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNext page={page} length={users.length} path="tags" />
                </Column>
                <Column small={12}>
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={`admin-users-${user._id}`}>
                                    <td>{decodeText(user.name.buffer)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Column>
                <Column small={12}>
                    <PrevNext page={page} length={users.length} path="tags" />
                </Column>
            </Row>
        </>
    )
}

const getUsers = async (page: number) => {
    const collection = await getCollection<T_User>(COLLECTION.USERS)
    return await collection
        .aggregate<T_User>([
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
        ])
        .toArray()
}
