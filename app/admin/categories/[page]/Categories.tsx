import Link from 'next/link'
/* Components */
import { PrevNext } from '@app/admin/_components/PrevNext'
import { Table } from '@common/components/containers/Table'
import { Header } from './Header'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Utils */
import {
    getCategories,
    updateCategory,
} from '@app/_lib/data/mongo/wordpress/category'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Categories(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const terms = await getCategories(page)

    const update = async (slug: string) => {
        'use server'
        if (!slug) return
        await updateCategory(slug)
    }

    return (
        <>
            <Header update={update} />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Show Posts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {terms.map((term) => (
                                <tr key={`admin-posts-${term.id}`}>
                                    <td>{term.id}</td>
                                    <td>{term.title}</td>
                                    <td>{term.slug}</td>
                                    <td>
                                        <Link
                                            href={`/admin/categories/posts/${term.slug}/1`}
                                        >
                                            Show Posts
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
                        length={terms.length}
                        path="categories"
                    />
                </Column>
            </Row>
        </>
    )
}
