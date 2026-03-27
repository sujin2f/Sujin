'use client'
import { startTransition, useActionState } from 'react'
/* Components */
import { Button } from '@app/_components/html-elements/Button'
import Callout from '@common-old/components/containers/Callout'
/* Utils */
import { publish } from '@app/_lib/utils/redis'

export default function FrontPage() {
    const [state, action, pending] = useActionState(() => publish('flush'), false)
    return (
        <>
            <h2>Admin</h2>
            {pending ? <Callout>..Flushing DB</Callout> : null}
            {state ? <Callout>DB Flushed</Callout> : null}
            <Button onClick={() => startTransition(action)}>Reset Mongo</Button>
        </>
    )
}
