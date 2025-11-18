'use client'
import { startTransition, useActionState } from 'react'
import { useRouter } from 'next/navigation'
/* Components */
import HeaderComponent from '@lib/components/admin/Header'
import Callout from '@common/components/containers/Callout'
import Button from '@common/components/forms/Button'
/* Utils */
import { refreshPosts } from '@lib/apollo/queries/wordpress/posts/refreshPosts'
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types'

type Props = {
    slug: string
    page: number
}
export function Header({ slug, page }: Props) {
    const router = useRouter()

    const [state, action, pending] = useActionState<QuantumBool>(async () => {
        return await refreshPosts(page, slug)
            .then(() => {
                router.refresh()
                return QuantumBool.TRUE
            })
            .catch(() => QuantumBool.FALSE)
    }, QuantumBool.MOD)

    return (
        <>
            <HeaderComponent title="Posts">
                <Button
                    title="Refresh All"
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
