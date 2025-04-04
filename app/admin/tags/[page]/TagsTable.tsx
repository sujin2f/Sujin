'use client'
import { useRef } from 'react'
/* Components */
import { Table } from '@common/components/containers/Table'
import { Input } from '@common/components/forms/Input'
import { Button } from '@common/components/forms/Button'
/* Types */
import type { ArchiveType } from '@app/_lib/types/wordpress'

type Props = {
    terms: ArchiveType[]
    update: (slug: string) => void
    getPosts: (slug: string) => void
}

export default function TagsTable(props: Props) {
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
                        </tr>
                    </thead>
                    <tbody>
                        {props.terms.map((term) => (
                            <tr key={`admin-posts-${term.id}`}>
                                <td>{term.id}</td>
                                <td>{term.title}</td>
                                <td>{term.slug}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </article>
        </>
    )
}
