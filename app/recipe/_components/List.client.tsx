'use client'
import Link from 'next/link'
import { use, useState } from 'react'
/* Components */
import Table from '@common/components/containers/Table'
import { Paging } from '@app/_components/Paging'
/* T_Types */
import type { PropWithPages, T_Recipe } from '@app/_lib/types'
import { QuantumBool } from '@common/types'
import type { T_Stringify } from '@common/types/mongo'
/* Utils */
import { useDelete } from '@app/recipe/_lib/useDelete'
import { useSession } from 'next-auth/react'

type Props = {
    readonly page: number
    readonly mine?: boolean
    readonly request: Promise<PropWithPages<T_Stringify<T_Recipe>>>
}

export function ListClient({ mine, page, request }: Props) {
    const session = useSession()
    const userId = session?.data?.user
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (session?.data?.user as any)._id
        : undefined
    const { list, pages } = use(request)
    const [_id, set_id] = useState<string>('')
    const { setConfirm, Confirm } = useDelete(_id, '')

    return (
        <>
            {Confirm}

            <Table fullWidth>
                <thead>
                    <tr>
                        <th>Item</th>
                        {userId && <th>Edit</th>}
                    </tr>
                </thead>
                <tbody>
                    {list.map((item) => (
                        <tr key={`recipe-list-${item._id.toString()}`}>
                            <td>
                                <Link href={`/recipe/item/${item._id}`}>
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
            </Table>
            <Paging
                pages={pages}
                page={page}
                urlPrefix={`/recipe/${mine ? 'mine' : ''}`}
            />
        </>
    )
}
