'use client'
import Link from 'next/link'
import { useState } from 'react'
/* Components */
import { Paging } from '@common/components/containers/Paging'
import { LoadingTable } from '@lib/components/archive/LoadingTable'
import { WidgetTitle } from '@app/_components/WidgetTitle'
/* T_Types */
import type { WithNumPages, T_Recipe } from '@sujin/lib/types'
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types'
/* Utils */
import { useUserInfo } from '@app/_hooks/useUserInfo'
import { useRecipeDelete } from '@app/_hooks/useRecipeDelete'
import { useServerAction } from '@app/_hooks/useServerAction'
import { getRecipes } from '@app/recipe/_lib/getRecipes'

type Props = { mine: boolean; page: number }

export default function PageRecipe({ mine, page }: Props) {
    const user = useUserInfo()
    const { data, loading, error } = useServerAction<WithNumPages<T_Recipe>>(async () => await getRecipes(page))
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
            <WidgetTitle>Recipe List</WidgetTitle>
            <table>
                <thead>
                    <tr>
                        <th className="text-left">Item</th>
                        {user?._id && <th>Edit</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={`recipe-item-${item._id.toString()}`}>
                            <td>
                                <Link href={`/recipe/detail/${item._id}`} className="text-primary hover:underline">
                                    {item.title}
                                </Link>
                            </td>
                            {user?._id && (
                                <td>
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
            </table>
            <Paging totalPages={numPages} currentPage={page} urlPrefix={`/recipe/${mine ? 'mine' : ''}`} />
        </>
    )
}
