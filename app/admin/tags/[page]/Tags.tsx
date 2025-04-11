/* Components */
import { PrevNext } from '@app/admin/_components/PrevNext'
import { Table } from '@common/components/containers/Table'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import Header from '@app/admin/_components/Header'
/* Utils */
import { getTags } from '@app/_lib/data/mongo/wordpress/tag'

type Props = {
    page: string
}

export default async function Tags(props: Props) {
    const page = parseInt(props.page)
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
                                <th>Total</th>
                                <th>Hits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {terms.map((term) => (
                                <tr key={`admin-posts-${term.id}`}>
                                    <td className="center">{term.id}</td>
                                    <td>{term.title}</td>
                                    <td>{term.slug}</td>
                                    <td className="center">{term.total}</td>
                                    <td className="center">{term.hits}</td>
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
