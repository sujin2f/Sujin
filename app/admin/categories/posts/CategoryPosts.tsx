import Link from 'next/link'
/* Components */
import { Table } from '@common/components/containers/Table'
import { PrevNext } from '@app/admin/_components/PrevNext'
import { Header } from './Header'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Utils */
import {
    getArchivePosts,
    updateArchivePosts,
} from '@app/_lib/data/mongo/wordpress/post'
/* Types */
import { ARCHIVE } from '@app/_lib/data/types'

type Props = {
    params: Promise<{
        page: string
        slug: string
    }>
}

export default async function CategoryPosts(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const posts = await getArchivePosts(ARCHIVE.CATEGORY, params.slug, page)

    const update = async (page: number) => {
        'use server'
        await updateArchivePosts(ARCHIVE.CATEGORY, params.slug, page)
    }

    return (
        <>
            <Header update={update} page={page} />
            <Row dom="article" fullWidth>
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
                            {posts.map((post) => (
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
                    <PrevNext
                        page={page}
                        length={posts.length}
                        path={`categories/posts/${params.slug}`}
                    />
                </Column>
            </Row>
        </>
    )
}
