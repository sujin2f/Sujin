'use client'
/* Components */
import Table from '@common/components/containers/Table'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { PrevNextAdmin } from '@lib/components/admin/PrevNextAdmin'
import { Header } from '@lib/components/admin/Header'
/* Utils */
import { useServerAction } from '@app/_lib/hooks/useServerAction'
/* T_Type */
import type { T_Archive } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_Archive[]>
    readonly page: number
}

export function TagsClient({ action, page }: Props) {
    const { data: tags, loading, error } = useServerAction<T_Archive[]>(action)

    if (loading || error) {
        return <></>
    }

    return (
        <>
            <Header title="Tags" />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={tags?.length || 0} path="tags" />
                </Column>
                <Column small={12}>
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Total</th>
                                <th>Hits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(tags || []).map((term) => (
                                <tr key={`admin-posts-${term._id}`}>
                                    <td>{term.title}</td>
                                    <td>{term.slug}</td>
                                    <td className="center">{term.total}</td>
                                    <td className="center">{term.hits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Column>
                <Column small={12}>
                    <PrevNextAdmin page={page} length={tags?.length || 0} path="tags" />
                </Column>
            </Row>
        </>
    )
}
