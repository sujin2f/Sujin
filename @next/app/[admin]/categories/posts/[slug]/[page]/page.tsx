import Link from 'next/link'
/* Components */
import { Header } from './Header'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { PrevNextAdmin } from '@lib/components/admin/PrevNextAdmin'
import Table from '@common/components/containers/Table'
/* Utils */
import { getPostsByCategory } from '@lib/apollo/query/getPostsByCategory'
import { getArchive } from '@lib/apollo/query/getArchive'

type Props = {
    params: Promise<{
        page: string
        slug: string
    }>
}

export default async function CategoryPosts(props: Props) {
    const { page: _page, slug } = await props.params
    const page = parseInt(_page)
    const archive = await getArchive(slug, 'category', 'ARCHIVE')
    const posts = await getPostsByCategory({
        category: archive.slug,
        page,
        query: 'id, title, slug link status',
    })
    const length = posts.post.length

    return (
        <>
            <Header archive={archive} page={page} />
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
                            {posts.post.map((post) => (
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
