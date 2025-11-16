'use server'
import Link from 'next/link'

/* Components */
import Table from '@common/components/containers/Table'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { PrevNextAdmin } from '@lib/components/admin/PrevNextAdmin'
import { Header } from './Header'
import { RemoveLink } from './RemoveLink'
import { RefreshLink } from './RefreshLink'
/* Utils */
import { getArchives } from '@lib/apollo/query/getArchives'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Categories({ params }: Props) {
    const { page: _page } = await params
    const page = parseInt(_page)

    const categories = await getArchives(
        page,
        ARCHIVE.CATEGORY,
        '_id title slug total',
    )

    const length = categories.archive.length

    return (
        <>
            <Header />

            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={length} path="pages" />
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
                            {categories.archive.map((term) => (
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
                                        <RefreshLink slug={term.slug} />
                                    </td>
                                    <td className="center">
                                        <RemoveLink slug={term.slug} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Column>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={length} path="pages" />
                </Column>
            </Row>
        </>
    )
}
