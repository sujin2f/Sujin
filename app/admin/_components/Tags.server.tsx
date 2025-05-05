/* Components */
import { PrevNext } from '@app/admin/_components/PrevNext'
import Table from '@common/components/containers/Table'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Header from '@app/admin/_components/Header'
/* Utils */
import { ARCHIVE } from '@app/_lib/types'
import { getArchives } from '@app/admin/_lib/getArchives'

type Props = {
    page: number
}

export async function TagsServer({ page }: Props) {
    const terms = await getArchives(ARCHIVE.TAG, page)

    return (
        <>
            <Header title="Tags" />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNext page={page} length={terms.length} path="tags" />
                </Column>
                <Column small={12}>
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Total</th>
                                <th>Hits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {terms.map((term) => (
                                <tr key={`admin-posts-${term._id}`}>
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
