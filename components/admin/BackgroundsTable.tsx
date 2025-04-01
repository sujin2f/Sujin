'use client'
import { Table } from '@common/components/containers/Table'
import type { Image } from '@src/types/wordpress'
import Link from 'next/link'

type Props = {
    backgrounds: Image[]
}

const BackgroundsTable = (props: Props) => {
    return (
        <article>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>mimeType</th>
                        <th>URL</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {props.backgrounds.map((background) => (
                        <tr key={`admin-background-${background.id}`}>
                            <td>{background.id}</td>
                            <td>{background.title}</td>
                            <td>{background.mimeType}</td>
                            <td>{background.url}</td>
                            <td>
                                <Link href={background.url} target="_blank">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </article>
    )
}

export default BackgroundsTable
