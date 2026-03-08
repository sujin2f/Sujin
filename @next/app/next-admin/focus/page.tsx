'use client'
import { useState } from 'react'
/* Components */
import { Paging } from '@app/_components/layout/Paging'
import { Button } from '@app/_components/html-elements/Button'
/* Utils */
import { useServerAction } from '@app/_lib/hooks/useServerAction'
import { getDevices } from '@app/next-admin/focus/_lib/getDevices'
import { removeDevices } from '@app/next-admin/focus/_lib/removeDevices'
/* T_Type */
import type { T_Focus_Device } from '@sujin/lib/types'

export default function FocusDevice() {
    const [page, setPage] = useState<number>(1)
    const { data, loading, error } = useServerAction<{
        items: T_Focus_Device[]
        total: number
    }>(() => getDevices(page), false, page)

    const button = <Button onClick={() => removeDevices().then(() => window.location.reload())}>Remove All</Button>
    if (loading || error || !data) return button

    return (
        <>
            {button}
            <table>
                <thead>
                    <tr>
                        <th>Device</th>
                        <th>Machine ID</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item) => (
                        <tr key={item._id}>
                            <td>{item.device}</td>
                            <td>{item.machineId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Paging totalPages={data.total} urlPrefix={''} currentPage={page} onClick={(page) => setPage(page)} />
        </>
    )
}
