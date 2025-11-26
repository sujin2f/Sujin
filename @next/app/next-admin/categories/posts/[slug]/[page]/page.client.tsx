'use client'
import Link from 'next/link'
/* Components */
import { Header } from './Header'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { PrevNextAdmin } from '@lib/components/admin/PrevNextAdmin'
import Table from '@common/components/containers/Table'
/* Utils */
import { useServerAction } from '@lib/hooks/useServerAction'
/* T_Type */
import type { T_ArchivePost } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_ArchivePost[]>
    readonly page: number
    readonly slug: string
}

export function CategoryPostsClient({ action, page, slug }: Props) {
    const { data: result, loading, error } = useServerAction<T_ArchivePost[]>(action)

    if (loading || error) {
        return <></>
    }

    return (
        <>
            <Header slug={slug} page={page} />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={result?.length || 0} path={`categories/posts/${slug}`} />
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
                            {(result || []).map((post) => (
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
                    <PrevNextAdmin page={page} length={result?.length || 0} path={`categories/posts/${slug}`} />
                </Column>
            </Row>
        </>
    )
}
