'use client'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
/* Components */
import { Button } from '@common/components/forms/Button'
import HeaderComponent from '@app/admin/_components/Header'
import { Input } from '@common/components/forms/Input'
import Callout from '@common/components/containers/Callout'
import { PrevNext } from '@app/admin/_components/PrevNext'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'

import { CategoryType } from '@app/_lib/data/mysql/types'
import Link from 'next/link'
import Table from '@common/components/containers/Table'

type Props = {
    readonly categories: CategoryType[]
    readonly page: number
    readonly remove: (slug: string) => Promise<string>
    readonly update: (slug: string) => Promise<string>
}

export function ClientComponent({ categories, page, remove, update }: Props) {
    const [message, setMessage] = useState('')
    const router = useRouter()
    const ref = useRef<HTMLInputElement>(null)

    return (
        <>
            <HeaderComponent title="Categories">
                <Input label="Pull from Wordpress" ref={ref} />
                <Button
                    title="Update"
                    onClick={() =>
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
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Show Posts</th>
                                <th>Update</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((term) => (
                                <tr key={`admin-posts-${term.id}`}>
                                    <td className="center">{term.id}</td>
                                    <td>{term.title}</td>
                                    <td className="center">{term.slug}</td>
                                    <td className="center">
                                        <Link
                                            href={`/admin/categories/posts/${term.slug}/1`}
                                        >
                                            Show Posts
                                        </Link>
                                    </td>
                                    <td className="center">
                                        <Link
                                            href="#"
                                            onClick={() =>
                                                update(term.slug).then(
                                                    (message) => {
                                                        setMessage(message)
                                                        router.refresh()
                                                    },
                                                )
                                            }
                                        >
                                            Update
                                        </Link>
                                    </td>
                                    <td className="center">
                                        <Link
                                            href="#"
                                            onClick={() =>
                                                remove(term.slug).then(
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
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Column>
                <Column small={12}>
                    <PrevNext
                        page={page}
                        length={categories.length}
                        path="pages"
                    />
                </Column>
            </Row>
        </>
    )
}
