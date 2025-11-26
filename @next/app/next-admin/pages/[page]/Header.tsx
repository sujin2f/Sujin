'use client'
import { startTransition, useActionState, useRef } from 'react'
import { useRouter } from 'next/navigation'
/* Components */
import HeaderComponent from '@lib/components/admin/Header'
import Callout from '@common/components/containers/Callout'
import InputGroup from '@common/components/forms/InputGroup'
/* Utils */
import { refreshPage } from '@lib/apollo/queries/wordpress/pages/refreshPage'
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types'

export function Header() {
    const router = useRouter()

    const [state, action, pending] = useActionState<QuantumBool, string>(async (_: QuantumBool, slug: string) => {
        return await refreshPage(slug)
            .then(() => {
                router.refresh()
                return QuantumBool.TRUE
            })
            .catch(() => QuantumBool.FALSE)
    }, QuantumBool.MOD)
    const ref = useRef<HTMLInputElement>(null)

    return (
        <>
            <HeaderComponent title="Pages">
                <InputGroup
                    ref={ref}
                    label="Slug"
                    button="Update"
                    onSubmit={() => {
                        if (!ref.current || !ref.current.value) {
                            return
                        }
                        startTransition(() => action(ref.current!.value))
                        ref.current!.value = ''
                    }}
                />
            </HeaderComponent>

            {pending ? <Callout>..Updating DB</Callout> : null}
            {state === QuantumBool.TRUE ? <Callout>DB Updated</Callout> : null}
            {state === QuantumBool.FALSE ? <Callout>DB Updated Failed</Callout> : null}
        </>
    )
}
