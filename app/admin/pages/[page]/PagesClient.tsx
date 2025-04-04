'use client'
import { useRef } from 'react'
import Link from 'next/link'
/* Components */
import { Table } from '@common/components/containers/Table'
import { Input } from '@common/components/forms/Input'
import { Button } from '@common/components/forms/Button'
/* Types */
import type { PageType } from '@src/types/wordpress'

type Props = {
    pages: PageType[]
    remove: (slug: string) => void
    refresh: (slug: string) => void
}

export default function PagesClient(props: Props) {
    const ref = useRef<HTMLInputElement>(null)
    return (
        <>
            <div>
                <Input label="Pull from Wordpress" ref={ref} />
                <Button
                    title="Update"
                    onClick={() => props.refresh(ref.current?.value || '')}
                />
            </div>
            <article>
                <Table>
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
                        {props.pages.map((post) => (
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
                                        onClick={() => props.remove(post.slug)}
                                    >
                                        Remove
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        href="#"
                                        onClick={() => props.refresh(post.slug)}
                                    >
                                        Refresh
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </article>
        </>
    )
}
