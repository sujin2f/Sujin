'use client'
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
import { useServerAction } from '@lib/hooks/useServerAction'
/* T_Type */
import type { T_Archive } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_Archive[]>
    readonly page: number
}

export function CategoriesClient({ action, page }: Props) {
    const { data: categories, loading, error } = useServerAction<T_Archive[]>(action)

    if (loading || error) {
        return <></>
    }

    return (
        <>
            <Header />

            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={categories?.length || 0} path="pages" />
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
                            {(categories || []).map((term) => (
                                <tr key={`admin-posts-${term._id}`}>
                                    <td>{term.title}</td>
                                    <td className="center">{term.slug}</td>
                                    <td className="center">{term.total}</td>
                                    <td className="center">
                                        <Link href={`/next-admin/categories/posts/${term.slug}/1`}>Show Posts</Link>
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
                    <PrevNextAdmin page={page} length={categories?.length || 0} path="pages" />
                </Column>
            </Row>
        </>
    )
}
