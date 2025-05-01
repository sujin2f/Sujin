'use client'
import Link from 'next/link'
import { use, useCallback, useState } from 'react'
/* Components */
import Table from '@common/components/containers/Table'
import Confirm from '@common/components/containers/Confirm'
/* T_Types */
import type { PropWithPages, T_Recipe, T_SessionUser } from '@app/_lib/types'
import type { T_Stringify } from '@common/types/mongo'
import { QuantumBool } from '@common/types'
import { Paging } from '@app/_components/Paging'

type Props = {
    readonly page: number
    readonly mine?: T_SessionUser | false
    readonly remove: (_id: string) => Promise<void>
    readonly request: Promise<PropWithPages<T_Stringify<T_Recipe>>>
}

export function ListClient({ mine, page, remove, request }: Props) {
    const { list, pages } = use(request)
    const [confirm, setConfirm] = useState<QuantumBool>(QuantumBool.FALSE)
    const [_id, set_id] = useState<string>('')

    const confirmDelete = useCallback(
        async (value: QuantumBool) => {
            setConfirm(value)
            if (value === QuantumBool.TRUE) {
                await remove(_id)
            }
        },
        [remove, _id],
    )

    return (
        <>
            <Confirm callback={confirmDelete} value={confirm}>
                Do you really want to delete this?
            </Confirm>
            <Table fullWidth>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Edit</th>
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
                            <td className="--center --fit-content">
                                {mine && mine._id === item.user && (
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
                                                set_id(item._id)
                                                setConfirm(QuantumBool.MOD)
                                            }}
                                        >
                                            Delete
                                        </Link>
                                    </>
                                )}
                            </td>
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
