'use client'
import { useState } from 'react'
/* Components */
import { Paging } from '@app/_components/layout/Paging'
import { WidgetTitle } from '@app/_components/WidgetTitle'
/* T_Types */
import type { WithNumPages, T_Recipe } from '@common/types'
/* CONSTANTS */
import { QuantumBool } from '@common/types'
/* Utils */
import { useUserInfo } from '@app/_lib/hooks/useUserInfo'
import { useRecipeDelete } from '@app/_lib/hooks/useRecipeDelete'
import { useServerAction } from '@app/_lib/hooks/useServerAction'
import { getRecipes } from '@app/recipe/_lib/getRecipes'
import { map } from '@common/utils/array'

type Props = { mine?: boolean; page: number }

export const dynamic = 'force-dynamic'

export function RecipeList({ mine, page }: Props) {
    const user = useUserInfo()
    const { data, loading, error } = useServerAction<WithNumPages<T_Recipe>>(getRecipes)
    const [_id, set_id] = useState<string>('')
    const { setConfirm, Confirm } = useRecipeDelete(_id)

    if (error) {
        throw error
    }
    if (!data) {
        return <></>
    }

    const { items, numPages } = data

    return (
        <>
            {Confirm}
            <WidgetTitle>Recipe List</WidgetTitle>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="text-left">Item</th>
                        {user?._id && <th className="text-center w-fit">Edit</th>}
                    </tr>
                </thead>
                <tbody>
                    {loading &&
                        map(12, (_, index) => (
                            <tr key={`loading-table-${index}`}>
                                <td>
                                    <div className="animate-pulse w-full bg-slate-500 text-slate-500 my-1">Loading</div>
                                </td>
                            </tr>
                        ))}
                    {items.map((item) => (
                        <tr key={`recipe-item-${item._id.toString()}`}>
                            <td>
                                <a href={`/recipe/detail/${item._id}`} className="text-primary hover:underline">
                                    {item.title}
                                </a>
                            </td>
                            {user?._id && (
                                <td className="text-center w-1 whitespace-nowrap">
                                    {user._id === item.user.toString() && (
                                        <>
                                            <a
                                                href={`/recipe/edit/${item._id}`}
                                                className="text-primary hover:underline"
                                            >
                                                Edit
                                            </a>{' '}
                                            |{' '}
                                            <a
                                                href="#"
                                                className="text-primary hover:underline"
                                                onClick={() => {
                                                    set_id(item._id.toString())
                                                    setConfirm(QuantumBool.MOD)
                                                }}
                                            >
                                                Delete
                                            </a>
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
