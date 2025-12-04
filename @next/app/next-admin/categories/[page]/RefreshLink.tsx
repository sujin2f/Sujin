'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Utils */
import { publish } from '@lib/redis/client'
/* T_Types */
import type { RedisMessageWordpress } from '@sujin/lib/types'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'

type Props = {
    readonly slug: string
}

export function RefreshLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                const message: RedisMessageWordpress = {
                    type: ARCHIVE.CATEGORY,
                    action: 'update',
                    slug,
                }
                await publish('wordpress', message)
                router.refresh()
            }}
        >
            Refresh
        </Link>
    )
}
