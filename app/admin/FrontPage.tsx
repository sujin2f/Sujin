'use client'
import { useRouter } from 'next/navigation'
/* Components */
import { Button } from '@common/components/forms/Button'

type Props = {
    dbVersion: string
    codeVersion: string
    database: string
    showMigrate: boolean
    migrate: () => Promise<void>
    reset: () => Promise<void>
}

export default function FrontPage({
    dbVersion,
    codeVersion,
    database,
    showMigrate,
    migrate,
    reset,
}: Props) {
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

            {showMigrate && (
                <Button
                    onClick={() =>
                        migrate().then(() => {
                            router.refresh()
                        })
                    }
                >
                    Migrate MongoDB
                </Button>
            )}

            <Button
                onClick={() =>
                    reset().then(() => {
                        router.refresh()
                    })
                }
            >
                Reset MongoDB
            </Button>
        </>
    )
}
