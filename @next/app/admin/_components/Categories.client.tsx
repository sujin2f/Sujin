'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useRef, useState } from 'react'
/* Components */
import HeaderComponent from '@app/admin/_components/Header'
import { PrevNext } from '@app/admin/_components/PrevNext'
import Callout from '@sujin/common/components/containers/Callout'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
import Table from '@sujin/common/components/containers/Table'
import InputGroup from '@sujin/common/components/forms/InputGroup'
/* T_Types */
import type { T_Archive } from '@app/_lib/types'

type Props = {
    readonly categories: Promise<T_Archive[]>
    readonly page: number
    readonly remove: (slug: string) => Promise<string>
    readonly update: (slug: string) => Promise<string>
}

export function CategoriesClient({ page, remove, update, ...props }: Props) {
    const categories = use(props.categories)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const ref = useRef<HTMLInputElement>(null)

    return (
        <>
            <HeaderComponent title="Categories">
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
                    <PrevNext
                        page={page}
                        length={categories.length}
                        path="pages"
                    />
                </Column>
                <Column small={12}>
                    <Table fullWidth data-testid="admin__categories__table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Total</th>
                                <th>Show Posts</th>
                                <th>Update</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((term) => (
                                <tr key={`admin-posts-${term._id}`}>
                                    <td>{term.title}</td>
                                    <td className="center">{term.slug}</td>
                                    <td className="center">{term.total}</td>
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
