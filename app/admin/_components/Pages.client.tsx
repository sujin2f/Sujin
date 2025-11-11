'use client'
import { useRouter } from 'next/navigation'
import { use, useRef, useState } from 'react'
import Link from 'next/link'
/* Components */
import HeaderComponent from '@app/admin/_components/Header'
import Callout from '@sujin/common/components/containers/Callout'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
import InputGroup from '@sujin/common/components/forms/InputGroup'
import Table from '@sujin/common/components/containers/Table'
import { PrevNext } from '@app/admin/_components/PrevNext'
/* T_Types */
import type { T_Page } from '@app/_lib/types'

type Props = {
    readonly pages: Promise<T_Page[]>
    readonly page: number
    readonly remove: (slug: string) => Promise<string>
    readonly update: (slug: string) => Promise<string>
}

export function PagesClient({ page, remove, update, ...props }: Props) {
    const pages = use(props.pages)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const ref = useRef<HTMLInputElement>(null)

    return (
        <>
            <HeaderComponent title="Pages">
                <InputGroup
                    ref={ref}
                    label="Slug"
                    button="Update"
                    onSubmit={() =>
                        update(ref.current?.value || '').then((message) => {
                            ref.current!.value = ''
                            setMessage(message)
                            router.refresh()
                        })
                    }
                />
            </HeaderComponent>
            {message ? <Callout>{message}</Callout> : null}
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNext page={page} length={pages.length} path="pages" />
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
                                <th>Remove</th>
                                <th>Refresh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map((post) => (
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
                                        <Link
                                            href="#"
                                            onClick={() =>
                                                remove(post.slug).then(
                                                    (message) => {
                                                        setMessage(message)
                                                        router.refresh()
                                                    },
                                                )
                                            }
                                        >
                                            Remove
                                        </Link>
                                    </td>
                                    <td className="center">
                                        <Link
                                            href="#"
                                            onClick={() =>
                                                update(post.slug).then(
                                                    (message) => {
                                                        setMessage(message)
                                                        router.refresh()
                                                    },
                                                )
                                            }
                                        >
                                            Refresh
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Column>
                <Column small={12}>
                    <PrevNext page={page} length={pages.length} path="pages" />
                </Column>
            </Row>
        </>
    )
}
