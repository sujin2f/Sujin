'use client'
import { Table } from '@common/components/containers/Table'
import type { Term } from '@src/types/wordpress'
import { Input } from '@common/components/forms/Input'
import { Button } from '@common/components/forms/Button'

type Props = {
    terms: Term[]
}

const TermsTable = (props: Props) => {
    return (
        <>
            <div>
                <Input label="Pull from Wordpress" />
                <Button title="Add" />
            </div>

            <article>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Slug</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.terms.map((term) => (
                            <tr key={`admin-posts-${term.id}`}>
                                <td>{term.id}</td>
                                <td>{term.title}</td>
                                <td>{term.slug}</td>
                                <td>{term.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </article>
        </>
    )
}

export default TermsTable
