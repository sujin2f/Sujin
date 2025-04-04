'use client'
import { useRef } from 'react'
/* Components */
import { Table } from '@common/components/containers/Table'
import { Input } from '@common/components/forms/Input'
import { Button } from '@common/components/forms/Button'
/* Types */
import type { ArchiveType } from '@app/_lib/data/mysql/types'
import Link from 'next/link'

type Props = {
    terms: ArchiveType[]
    update: (slug: string) => void
}

export default function CategoriesTable(props: Props) {
    const ref = useRef<HTMLInputElement>(null)
    return (
        <>
            <div>
                <Input label="Pull from Wordpress" ref={ref} />
                <Button
                    title="Update"
                    onClick={() => props.update(ref.current?.value || '')}
                />
            </div>

            <article>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Slug</th>
                            <th>Get Posts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.terms.map((term) => (
                            <tr key={`admin-posts-${term.id}`}>
                                <td>{term.id}</td>
                                <td>{term.title}</td>
                                <td>{term.slug}</td>
                                <td>
                                    <Link
                                        href={`/admin/categories/posts/${term.slug}/1`}
                                    >
                                        Get Posts
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
