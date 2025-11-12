'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
/* Components */
import Button from '@sujin/common/components/forms/Button'
import Callout from '@sujin/common/components/containers/Callout'

type Props = {
    dbVersion: string
    codeVersion: string
    database: string
    showMigrate: boolean
    migrate: (current: string) => Promise<string>
    reset: () => Promise<string>
}

export function FrontPageClient({
    dbVersion,
    codeVersion,
    database,
    showMigrate,
    migrate,
    reset,
}: Props) {
    const [message, setMessage] = useState('')
    const router = useRouter()
    return (
        <>
            <h2>Admin</h2>
            <dl>
                <dt>DB | Code Version</dt>
                <dd>
                    {dbVersion} | {codeVersion}
                </dd>

                <dt>Mongo Database</dt>
                <dd>{database}</dd>
            </dl>
            {message ? <Callout>{message}</Callout> : null}
            {showMigrate && (
                <Button
                    onClick={() =>
                        migrate(dbVersion)
                            .then((message) => {
                                setMessage(message)
                                router.refresh()
                            })
                            .catch((e) => setMessage(e.message))
                    }
                >
                    Migrate MongoDB
                </Button>
            )}{' '}
            <Button
                onClick={() =>
                    reset()
                        .then((message) => {
                            setMessage(message)
                            router.refresh()
                        })
                        .catch(() => setMessage('Failed'))
                }
            >
                Reset Mongo
            </Button>
        </>
    )
}
