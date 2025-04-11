'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
/* Components */
import { Button } from '@common/components/forms/Button'
import { Table } from '@common/components/containers/Table'
import { PrevNext } from '@app/admin/_components/PrevNext'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import Header from '@app/admin/_components/Header'
import Callout from '@common/components/containers/Callout'
/* T_Types */
import { T_PostArchive } from '@app/_lib/types'

type Props = {
    readonly page: number
    readonly slug: string
    readonly posts: T_PostArchive[]
    readonly update: (slug: string, page: number) => Promise<string>
}

export function ClientComponent({ page, slug, posts, update }: Props) {
    const [message, setMessage] = useState('')
    const router = useRouter()

    return (
        <>
            <Header title={`Category Posts: ${slug}`}>
                <Button
                    title="Pull from WP"
                    onClick={() =>
                        update(slug, page).then((message) => {
                            setMessage(message)
                            router.refresh()
                        })
                    }
                />
            </Header>
            {message ? <Callout>{message}</Callout> : null}
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNext
                        page={page}
                        length={posts.length}
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
                        path={`categories/posts/${slug}`}
                    />
                </Column>
            </Row>
        </>
    )
}
