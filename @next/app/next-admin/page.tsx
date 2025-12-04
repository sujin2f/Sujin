'use client'
import { startTransition, useActionState } from 'react'
/* Components */
import Button from '@common/components/forms/Button'
import Callout from '@common/components/containers/Callout'
/* CONSTANTS */
import { VERSION } from '@sujin/share/constants/helper'
/* Utils */
import { publish } from '@lib/redis/client'

export default function FrontPage() {
    const [state, action, pending] = useActionState(() => publish('flush'), false)
    return (
        <>
            <h2>Admin</h2>
            <dl>
                <dt>Code Version</dt>
                <dd>{VERSION}</dd>
            </dl>
            {pending ? <Callout>..Flushing DB</Callout> : null}
            {state ? <Callout>DB Flushed</Callout> : null}
            <Button onClick={() => startTransition(action)}>Reset Mongo</Button>
        </>
    )
}
