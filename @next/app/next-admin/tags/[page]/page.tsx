/* Components */
import Table from '@common/components/containers/Table'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { PrevNextAdmin } from '@lib/components/admin/PrevNextAdmin'
import { Header } from '@lib/components/admin/Header'
/* Utils */
import { GQLRequest } from '@lib/apollo/GQLRequest'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
import LIST_QUERY from '@lib/apollo/gql/archive.list.graphql'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Tags({ params }: Props) {
    const { page: _page } = await params
    const page = parseInt(_page)

    const tags = await GQLRequest<{ archive: T_Archive[] }>(LIST_QUERY, {
        page,
        type: ARCHIVE.TAG,
    })
        .then((result) => {
            if (!result || !result.data) {
                return []
            }
            return result.data.archive
        })
        .catch(() => [])

    return (
        <>
            <Header title="Tags" />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin
                        page={page}
                        length={tags.length}
                        path="tags"
                    />
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
                            {tags.map((term) => (
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
                    <PrevNextAdmin
                        page={page}
                        length={tags.length}
                        path="tags"
                    />
                </Column>
            </Row>
        </>
    )
}
