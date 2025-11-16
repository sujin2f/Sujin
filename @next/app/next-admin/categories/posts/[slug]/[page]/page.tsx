import Link from 'next/link'
/* Components */
import { Header } from './Header'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { PrevNextAdmin } from '@lib/components/admin/PrevNextAdmin'
import Table from '@common/components/containers/Table'
/* Utils */
import { GQLRequest } from '@lib/apollo/GQLRequest'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'
/* CONSTANTS */
import { POST_TYPE } from '@sujin/lib/constants'
import LIST_QUERY from '@lib/apollo/gql/post.list.admin.graphql'

type Props = {
    params: Promise<{
        page: string
        slug: string
    }>
}

export default async function CategoryPosts(props: Props) {
    const { page: _page, slug } = await props.params
    const page = parseInt(_page)
    const result = await GQLRequest<{ postAdmin: T_ArchivePost[] }>(
        LIST_QUERY,
        {
            page,
            postType: POST_TYPE.POST,
            category: slug,
        },
    )
        .then((result) => {
            if (!result || !result.data) {
                return []
            }

            return result.data.postAdmin
        })
        .catch(() => [])
    const length = result.length

    return (
        <>
            <Header slug={slug} page={page} />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin
                        page={page}
                        length={length}
                        path={`categories/posts/${slug}`}
                    />
                </Column>
                <Column small={12}>
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Status</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((post) => (
                                <tr key={`admin-posts-${post.id}`}>
                                    <td>{post.id}</td>
                                    <td>{post.title}</td>
                                    <td>{post.slug}</td>
                                    <td>{post.status}</td>
                                    <td>
                                        <Link href={post.link} target="_blank">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Column>
                <Column small={12}>
                    <PrevNextAdmin
                        page={page}
                        length={length}
                        path={`categories/posts/${slug}`}
                    />
                </Column>
            </Row>
        </>
    )
}
