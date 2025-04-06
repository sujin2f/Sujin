/* Components */
import { PrevNext } from '@app/admin/_components/PrevNext'
import { Table } from '@common/components/containers/Table'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import Header from '@app/admin/_components/Header'
/* Utils */
import { getTags } from '@app/_lib/data/mongo/wordpress/tag'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Tags(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const terms = await getTags(page)

    return (
        <>
            <Header title="Tags" />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Slug</th>
                            </tr>
                        </thead>
                        <tbody>
                            {terms.map((term) => (
                                <tr key={`admin-posts-${term.id}`}>
                                    <td>{term.id}</td>
                                    <td>{term.title}</td>
                                    <td>{term.slug}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Column>
                <Column small={12}>
                    <PrevNext page={page} length={terms.length} path="tags" />
                </Column>
            </Row>
        </>
    )
}
