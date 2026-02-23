'use client'
import { startTransition, useActionState } from 'react'
import { useRouter } from 'next/navigation'
/* Components */
import HeaderComponent from '@lib/components/admin/Header'
import Callout from '@common/components/containers/Callout'
/* Utils */
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types'
import Button from '@common/components/forms/Button'
/* Utils */
import { publish } from '@app/_lib/utils/redis'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
/* T_Types */
import type { RedisMessageWordpress } from '@sujin/lib/types'

type Props = {
    page: number
}
export function Header({ page }: Props) {
    const router = useRouter()

    const [state, action, pending] = useActionState<QuantumBool>(async () => {
        const message: RedisMessageWordpress = {
            type: ARCHIVE.CATEGORY,
            action: 'update',
            slug: '',
            page,
        }
        return await publish('wordpress', message)
            .then(() => {
                router.refresh()
                return QuantumBool.TRUE
            })
            .catch(() => QuantumBool.FALSE)
    }, QuantumBool.MOD)

    return (
        <>
            <HeaderComponent title="Posts">
                <Button title="Refresh All" onClick={() => startTransition(action)} />
            </HeaderComponent>
            {pending ? <Callout>..Updating DB</Callout> : null}
            {state === QuantumBool.TRUE ? <Callout>DB Updated</Callout> : null}
            {state === QuantumBool.FALSE ? <Callout>DB Updated Failed</Callout> : null}
        </>
    )
}
