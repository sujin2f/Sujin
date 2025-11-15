'use client'
import { startTransition, useActionState } from 'react'
import { useRouter } from 'next/navigation'
/* Components */
import HeaderComponent from '@lib/components/admin/Header'
import Callout from '@common/components/containers/Callout'
import Button from '@common/components/forms/Button'
/* Utils */
import { updatePostsFromWP } from '@lib/apollo/mutation/updatePostsFromWP'
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

type Props = {
    archive: T_Archive
    page: number
}
export function Header({ archive, page }: Props) {
    const router = useRouter()

    const [state, action, pending] = useActionState<QuantumBool>(async () => {
        return await updatePostsFromWP(archive.slug, page)
            .then(() => {
                router.refresh()
                return QuantumBool.TRUE
            })
            .catch(() => QuantumBool.FALSE)
    }, QuantumBool.MOD)

    return (
        <>
            <HeaderComponent
                title={`Category Posts: ${archive.slug}  ${archive._id}`}
            >
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
