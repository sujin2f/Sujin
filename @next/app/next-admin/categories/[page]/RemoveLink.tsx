'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Utils */
import { publish } from '@app/_lib/redis'
/* T_Types */
import type { RedisMessageWordpress } from '@sujin/lib/types'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'

type Props = {
    readonly slug: string
}

export function RemoveLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                const message: RedisMessageWordpress = {
                    type: ARCHIVE.CATEGORY,
                    action: 'remove',
                    slug,
                }
                await publish('wordpress', message)
                router.refresh()
            }}
        >
            Remove
        </Link>
    )
}
