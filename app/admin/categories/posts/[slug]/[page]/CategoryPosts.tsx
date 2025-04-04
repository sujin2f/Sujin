import Link from 'next/link'
/* Components */
import { Table } from '@common/components/containers/Table'
import { PrevNext } from '@app/components/single/PrevNext'
/* Constants */
import { PER_PAGE } from '@src/constants/mysql-query'
/* Utils */
import { getMySQLArchivePosts } from '@src/db/mongo/wordpress/post'
/* Types */
import { ARCHIVE, type PostType } from '@src/types/wordpress'

type Props = {
    params: Promise<{
        page: string
        slug: string
    }>
}

export default async function CategoryPosts(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const posts = await getMySQLArchivePosts(
        ARCHIVE.CATEGORY,
        params.slug,
        page,
    )

    const prev =
        page !== 1
            ? ({
                  title: 'Prev',
                  link: `/admin/categories/posts/${params.slug}/${page - 1}`,
              } as PostType)
            : undefined
    const next =
        posts.length === PER_PAGE
            ? ({
                  title: 'Next',
                  link: `/admin/categories/posts/${params.slug}/${page + 1}`,
              } as PostType)
            : undefined

    return (
        <>
            <h2>Category Posts: {params.slug}</h2>
            <article>
                <Table>
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
            </article>
            <PrevNext posts={[prev, next]} />
        </>
    )
}
