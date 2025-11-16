'use server'
import Link from 'next/link'

/* Components */
import Table from '@common/components/containers/Table'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { PrevNextAdmin } from '@lib/components/admin/PrevNextAdmin'
import { Header } from './Header'
import { RemoveLink } from './RemoveLink'
import { RefreshLink } from './RefreshLink'
/* Utils */
import { GQLRequest } from '@lib/apollo/GQLRequest'
/* CONSTANTS */
import LIST_QUERY from '@lib/constants/gql/post.list.admin.graphql'
import { POST_TYPE } from '@sujin/lib/constants'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Pages({ params }: Props) {
    const { page: _page } = await params
    const page = parseInt(_page)

    const result = await GQLRequest<{ post: T_ArchivePost[] }>(LIST_QUERY, {
        page,
        postType: POST_TYPE.PAGE,
    })
        .then((result) => {
            if (!result || !result.data) {
                return []
            }

            return result.data.post
        })
        .catch(() => [])

    const length = result.length

    return (
        <>
            <Header />

            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={length} path="pages" />
                </Column>
                <Column small={12}>
                    <Table fullWidth data-testid="admin__pages__table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Status</th>
                                <th>View</th>
                                <th>Remove</th>
                                <th>Refresh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((post) => (
                                <tr key={`admin-posts-${post._id}`}>
                                    <td className="center">{post.id}</td>
                                    <td>{post.title}</td>
                                    <td className="center">{post.slug}</td>
                                    <td className="center">{post.status}</td>
                                    <td className="center">
                                        <Link href={post.link} target="_blank">
                                            View
                                        </Link>
                                    </td>
                                    <td className="center">
                                        <RemoveLink slug={post.slug} />
                                    </td>
                                    <td className="center">
                                        <RefreshLink slug={post.slug} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Column>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={length} path="pages" />
                </Column>
            </Row>
        </>
    )
}
