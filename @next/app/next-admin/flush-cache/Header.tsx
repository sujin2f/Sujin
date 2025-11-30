'use client'
import { startTransition, useActionState } from 'react'
import { useRouter } from 'next/navigation'
/* Components */
import HeaderComponent from '@lib/components/admin/Header'
import Callout from '@common/components/containers/Callout'
import Button from '@common/components/forms/Button'
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types'

type Props = {
    readonly action: () => Promise<void>
}

export function Header({ action: flushCache }: Props) {
    const router = useRouter()

    const [state, action, pending] = useActionState<QuantumBool>(async () => {
        return await flushCache()
            .then(() => {
                router.refresh()
                return QuantumBool.TRUE
            })
            .catch(() => QuantumBool.FALSE)
    }, QuantumBool.MOD)

    return (
        <>
            <HeaderComponent title="Cache">
                <Button title="Flush All" onClick={() => startTransition(action)} />
            </HeaderComponent>
            {pending ? <Callout>..Flushing</Callout> : null}
            {state === QuantumBool.TRUE ? <Callout>Done!</Callout> : null}
            {state === QuantumBool.FALSE ? <Callout>Failed</Callout> : null}
        </>
    )
}
