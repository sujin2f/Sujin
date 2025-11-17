'use client'
import Link from 'next/link'
import { use, useState } from 'react'
/* Components */
import Table from '@common/components/containers/Table'
import { Paging } from '@lib/components/archive/Paging'
/* T_Types */
import type { PropWithPages, T_Recipe } from '@sujin/lib/types'
import { QuantumBool } from '@sujin/share/types'

type Props = {
    readonly page: number
    readonly mine?: boolean
    readonly request: unknown
}

export function ListClient({ mine, page, request }: Props) {
    return <></>
    // const session = useSession()
    // const userId = session?.data?.user
    //     ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //       (session?.data?.user as any)._id
    //     : undefined
    // const { list, pages } = use(request)
    // const [_id, set_id] = useState<string>('')
    // const { setConfirm, Confirm } = useDelete(_id, '/recipe/1')

    // return (
    //     <>
    //         {Confirm}

    //         <Table fullWidth>
    //             <thead>
    //                 <tr>
    //                     <th>Item</th>
    //                     {userId && <th>Edit</th>}
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {list.map((item) => (
    //                     <tr key={`recipe-list-${item._id.toString()}`}>
    //                         <td>
    //                             <Link href={`/recipe/item/${item._id}`}>
    //                                 {item.title}
    //                             </Link>
    //                         </td>
    //                         {userId && (
    //                             <td className="--center --fit-content">
    //                                 {userId === item.user.toString() && (
    //                                     <>
    //                                         <Link
    //                                             href={`/recipe/mutate/${item._id}`}
    //                                         >
    //                                             Modify
    //                                         </Link>{' '}
    //                                         |{' '}
    //                                         <Link
    //                                             href="#"
    //                                             onClick={() => {
    //                                                 set_id(item._id.toString())
    //                                                 setConfirm(QuantumBool.MOD)
    //                                             }}
    //                                         >
    //                                             Delete
    //                                         </Link>
    //                                     </>
    //                                 )}
    //                             </td>
    //                         )}
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </Table>
    //         <Paging
    //             pages={pages}
    //             page={page}
    //             urlPrefix={`/recipe/${mine ? 'mine' : ''}`}
    //         />
    //     </>
    // )
}
