'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Components */
import TableComponent from '@common/components/containers/Table'
/* Types */
import type { T_Page } from '@app/_lib/types'
import type { Dispatch, SetStateAction } from 'react'

type Props = {
    pages: T_Page[]
    remove: (slug: string) => Promise<string>
    update: (slug: string) => Promise<string>
    setMessage: Dispatch<SetStateAction<string>>
}

export function Table({ pages, remove, update, setMessage }: Props) {
    const router = useRouter()
    return (
        <TableComponent fullWidth>
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
                            <Link
                                href="#"
                                onClick={() =>
                                    remove(post.slug).then((message) => {
                                        setMessage(message)
                                        router.refresh()
                                    })
                                }
                            >
                                Remove
                            </Link>
                        </td>
                        <td className="center">
                            <Link
                                href="#"
                                onClick={() =>
                                    update(post.slug).then((message) => {
                                        setMessage(message)
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
        </TableComponent>
    )
}
