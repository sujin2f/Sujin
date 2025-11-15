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
import { getPages } from '@lib/apollo/query/getPages'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Pages({ params }: Props) {
    const { page: _page } = await params
    const page = parseInt(_page)

    const pages = await getPages(page, 'id title slug status link')
    const length = pages.post.length

    return (
        <>
            <Header />

            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={length} path="pages" />
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
                            {pages.post.map((post) => (
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
                                        <RemoveLink slug={post.slug} />
                                    </td>
                                    <td className="center">
                                        <RefreshLink slug={post.slug} />
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
