'use client'
import Link from 'next/link'
import { use, useState } from 'react'
/* Components */
import { default as TableComponent } from '@common/components/containers/Table'
import { Paging } from '@lib/components/archive/Paging'
/* T_Types */
import type { WithNumPages, T_Recipe, T_User } from '@sujin/lib/types'
import { QuantumBool } from '@sujin/share/types'
import { useSession } from 'next-auth/react'
import { useRecipeDelete } from '@lib/hooks/useRecipeDelete'

type Props = {
    readonly promise: Promise<WithNumPages<T_Recipe>>
    readonly page: number
    readonly mine?: boolean
}

export function Table({ promise, mine, page }: Props) {
    const session = useSession()
    const userId = session?.data?.user
        ? (session?.data?.user as T_User)._id
        : undefined
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
                        {userId && <th>Edit</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={`recipe-list-${item._id.toString()}`}>
                            <td>
                                <Link href={`/recipe/detail/${item._id}`}>
                                    {item.title}
                                </Link>
                            </td>
                            {userId && (
                                <td className="--center --fit-content">
                                    {userId === item.user.toString() && (
                                        <>
                                            <Link
                                                href={`/recipe/mutate/${item._id}`}
                                            >
                                                Modify
                                            </Link>{' '}
                                            |{' '}
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
            <Paging
                pages={numPages}
                page={page}
                urlPrefix={`/recipe/${mine ? 'mine' : ''}`}
            />
        </>
    )
}
