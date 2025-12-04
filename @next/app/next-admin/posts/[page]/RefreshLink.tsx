'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Utils */
import { publish } from '@lib/redis/client'
/* T_Types */
import type { RedisMessageWordpress } from '@sujin/lib/types'
/* CONSTANTS */
import { POST_TYPE } from '@sujin/lib/constants'

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
                    type: POST_TYPE.POST,
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
