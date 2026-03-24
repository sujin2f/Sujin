'use client'
import { startTransition, useActionState } from 'react'
import { useRouter } from 'next/navigation'
/* Components */
import HeaderComponent from '@lib/components/admin/Header'
import Callout from '@common-old/components/containers/Callout'
import { Button } from '@app/_components/html-elements/Button'
/* Utils */
import { publish } from '@app/_lib/utils/redis'
/* CONSTANTS */
import { QuantumBool } from '@common/types'
import { ARCHIVE } from '@common/constants'
/* T_Types */
import type { RedisMessageWordpress } from '@common/types'

type Props = {
    slug: string
    page: number
}
export function Header({ slug, page }: Props) {
    const router = useRouter()

    const [state, action, pending] = useActionState<QuantumBool>(async () => {
        const message: RedisMessageWordpress = {
            type: ARCHIVE.CATEGORY,
            action: 'update',
            slug,
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
            <HeaderComponent title={`Posts in ${slug}`}>
                <Button onClick={() => startTransition(action)}>Refresh All</Button>
            </HeaderComponent>
            {pending ? <Callout>..Updating DB</Callout> : null}
            {state === QuantumBool.TRUE ? <Callout>DB Updated</Callout> : null}
            {state === QuantumBool.FALSE ? <Callout>DB Updated Failed</Callout> : null}
        </>
    )
}
