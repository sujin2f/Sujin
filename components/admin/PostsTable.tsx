'use client'
import { Table } from '@common/components/containers/Table'
import type { Post } from '@src/types/wordpress'
import Link from 'next/link'

type Props = {
    posts: Post[]
}

const PostsTable = (props: Props) => {
    return (
        <article>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {props.posts.map((post) => (
                        <tr key={`admin-posts-${post.id}`}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{post.slug}</td>
                            <td>{post.type}</td>
                            <td>{post.status}</td>
                            <td>
                                <Link href={`/blog/${post.slug}`}>View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </article>
    )
}

export default PostsTable
