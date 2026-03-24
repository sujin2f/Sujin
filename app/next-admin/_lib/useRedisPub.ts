'use client'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
/* Utils */
import { publish } from '@app/_lib/utils/redis'
/* T_Type */
import type { RedisMessageWordpress } from '@common/types'
/* CONSTANTS */
import { QuantumBool } from '@common/types'
import { ARCHIVE, POST_TYPE } from '@common/constants'

type Props = [ARCHIVE | POST_TYPE, 'update' | 'remove', string, number?]

export const useRedisPub = () => {
    const router = useRouter()

    return useActionState<QuantumBool, Props>(async (_: QuantumBool, [type, action, slug, page]: Props) => {
        const message: RedisMessageWordpress = {
            type,
            action,
            slug,
            page,
        }

        if (!page) delete message.page

        return await publish('wordpress', message)
            .then(() => {
                router.refresh()
                return QuantumBool.TRUE
            })
            .catch(() => QuantumBool.FALSE)
    }, QuantumBool.MOD)
}
