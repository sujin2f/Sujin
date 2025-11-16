'use client'
import { startTransition, useActionState } from 'react'
import { useRouter } from 'next/navigation'
/* Components */
import HeaderComponent from '@lib/components/admin/Header'
import Callout from '@common/components/containers/Callout'
import Button from '@common/components/forms/Button'
/* Utils */
import { updatePosts } from '@lib/apollo/mutation/updatePosts'
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types'
/* T_Types */

type Props = {
    slug: string
    page: number
}
export function Header({ slug, page }: Props) {
    const router = useRouter()

    const [state, action, pending] = useActionState<QuantumBool>(async () => {
        return await updatePosts(slug, page)
            .then(() => {
                router.refresh()
                return QuantumBool.TRUE
            })
            .catch(() => QuantumBool.FALSE)
    }, QuantumBool.MOD)

    return (
        <>
            <HeaderComponent title={`Category Posts: ${slug}`}>
                <Button
                    title="Pull from WP"
                    onClick={() => startTransition(action)}
                />
            </HeaderComponent>
            {pending ? <Callout>..Updating DB</Callout> : null}
            {state === QuantumBool.TRUE ? <Callout>DB Updated</Callout> : null}
            {state === QuantumBool.FALSE ? (
                <Callout>DB Updated Failed</Callout>
            ) : null}
        </>
    )
}
