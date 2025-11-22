'use client'
import Link from 'next/link'
import { use, useState } from 'react'
/* Components */
import { default as TableComponent } from '@common/components/containers/Table'
import { Paging } from '@lib/components/archive/Paging'
/* T_Types */
import type { WithNumPages, T_Recipe } from '@sujin/lib/types'
import { QuantumBool } from '@sujin/share/types'
import { useUserInfo } from '@lib/hooks/useUserInfo'
import { useRecipeDelete } from '@lib/hooks/useRecipeDelete'

type Props = {
    readonly promise: Promise<WithNumPages<T_Recipe>>
    readonly page: number
    readonly mine?: boolean
}

export function Table({ promise, mine, page }: Props) {
    const user = useUserInfo()
    const { items, numPages } = use(promise)
    const [_id, set_id] = useState<string>('')
    const { setConfirm, Confirm } = useRecipeDelete(_id)

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
                                            <Link href={`/recipe/mutate/${item._id}`}>Modify</Link> |{' '}
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
