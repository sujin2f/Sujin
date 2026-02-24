'use client'
import Link from 'next/link'
import { useState } from 'react'
/* Components */
import { default as TableComponent } from '@common/components/containers/Table'
import { Paging } from '@lib/components/archive/Paging'
import { LoadingTable } from '@lib/components/archive/LoadingTable'
/* T_Types */
import type { WithNumPages, T_Recipe } from '@sujin/lib/types'
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types'
/* Utils */
import { useUserInfo } from '@app/_lib/hooks/useUserInfo'
import { useRecipeDelete } from '@app/_lib/hooks/useRecipeDelete'
import { useServerAction } from '@app/_lib/hooks/useServerAction'

type Props = {
    readonly action: () => Promise<WithNumPages<T_Recipe>>
    readonly page: number
    readonly mine?: boolean
}

export function RecipeTable({ action, mine, page }: Props) {
    const user = useUserInfo()
    const { data, loading, error } = useServerAction<WithNumPages<T_Recipe>>(action)
    const [_id, set_id] = useState<string>('')
    const { setConfirm, Confirm } = useRecipeDelete(_id)

    if (loading) {
        return <LoadingTable />
    }
    if (error) {
        throw error
    }

    const { items, numPages } = data!

    return (
        <>
            {Confirm}

            <TableComponent fullWidth>
                <thead>
                    <tr>
                        <th>Item</th>
                        {user?._id && <th>Edit</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={`recipe-list-${item._id.toString()}`}>
                            <td>
                                <Link href={`/recipe/detail/${item._id}`}>{item.title}</Link>
                            </td>
                            {user?._id && (
                                <td className="--center --fit-content">
                                    {user._id === item.user.toString() && (
                                        <>
                                            <Link href={`/recipe/edit/${item._id}`}>Edit</Link> |{' '}
                                            <Link
                                                href="#"
                                                onClick={() => {
                                                    set_id(item._id.toString())
                                                    setConfirm(QuantumBool.MOD)
                                                }}
                                            >
                                                Delete
                                            </Link>
                                        </>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </TableComponent>
            <Paging pages={numPages} page={page} urlPrefix={`/recipe/${mine ? 'mine' : ''}`} />
        </>
    )
}
