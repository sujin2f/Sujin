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

export function Header() {
    const router = useRouter()

    const [state, action, pending] = useActionState<QuantumBool>(async () => {
        return await publish('backgrounds')
            .then(() => {
                router.refresh()
                return QuantumBool.TRUE
            })
            .catch(() => QuantumBool.FALSE)
    }, QuantumBool.MOD)

    return (
        <>
            <HeaderComponent title="Backgrounds"></HeaderComponent>
            <Button onClick={() => startTransition(action)}>Refresh All</Button>
            {pending ? <Callout>..Updating DB</Callout> : null}
            {state === QuantumBool.TRUE ? <Callout>DB Updated</Callout> : null}
            {state === QuantumBool.FALSE ? <Callout>DB Updated Failed</Callout> : null}
        </>
    )
}
