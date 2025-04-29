'use client'
import Link from 'next/link'
import { useCallback, useState } from 'react'
/* Components */
import Table from '@common/components/containers/Table'
import Confirm from '@common/components/containers/Confirm'
/* T_Types */
import type { T_Recipe, T_SessionUser } from '@app/_lib/types'
import type { T_Stringify } from '@common/types/mongo'
import { QuantumBool } from '@common/types'

type Props = {
    readonly list: T_Stringify<T_Recipe>[]
    readonly mine?: T_SessionUser | false
    readonly remove: (_id: string) => Promise<void>
}

export function ListClient({ list, mine, remove }: Props) {
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
        </>
    )
}
