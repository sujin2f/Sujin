'use client'
import Link from 'next/link'
/* Components */
import Table from '@common/components/containers/Table'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { PrevNextAdmin } from '@lib/components/admin/PrevNextAdmin'
import { Header } from './Header'
import { RefreshLink } from './RefreshLink'
/* Utils */
import { useServerAction } from '@app/_hooks/useServerAction'
/* T_Type */
import type { T_ArchivePost } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_ArchivePost[]>
    readonly page: number
}

export function PostsClient({ page, action }: Props) {
    const { data: result, loading, error } = useServerAction<T_ArchivePost[]>(action)

    if (loading || error) {
        return <></>
    }

    return (
        <>
            <Header page={page} />

            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={result?.length || 0} path="posts" />
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
                                <th>Refresh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(result || []).map((post) => (
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
                                        <RefreshLink slug={post.slug} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Column>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={result?.length || 0} path="posts" />
                </Column>
            </Row>
        </>
    )
}
