'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Components */
import { Table } from '@common/components/containers/Table'
/* Types */
import type { PageType } from '@app/_lib/data/mysql/types'

type Props = {
    pages: PageType[]
    remove: (slug: string) => Promise<void>
    refresh: (slug: string) => Promise<void>
}

export function PagesTable({ pages, remove, refresh }: Props) {
    const router = useRouter()
    return (
        <Table fullWidth>
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
                {pages.map((post) => (
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
                        <td>
                            <Link
                                href="#"
                                onClick={() =>
                                    remove(post.slug).then(() => {
                                        router.refresh()
                                    })
                                }
                            >
                                Remove
                            </Link>
                        </td>
                        <td>
                            <Link
                                href="#"
                                onClick={() =>
                                    refresh(post.slug).then(() => {
                                        router.refresh()
                                    })
                                }
                            >
                                Refresh
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}
