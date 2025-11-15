/* Components */
import Table from '@common/components/containers/Table'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { PrevNextAdmin } from '@lib/components/admin/PrevNextAdmin'
import { Header } from '@lib/components/admin/Header'
/* Utils */
import { getArchives } from '@lib/apollo/query/getArchives'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Tags({ params }: Props) {
    const { page: _page } = await params
    const page = parseInt(_page)

    const tags = await getArchives(
        page,
        ARCHIVE.TAG,
        '_id title slug total hits',
    )

    const length = tags.archives.length

    return (
        <>
            <Header title="Tags" />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={length} path="tags" />
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
                            {tags.archives.map((term) => (
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
                    <PrevNextAdmin page={page} length={length} path="tags" />
                </Column>
            </Row>
        </>
    )
}
