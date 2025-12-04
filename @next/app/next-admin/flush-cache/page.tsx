'use server'
/* Components */
import { Header } from '@app/next-admin/flush-cache/Header'
/* Utils */
import { publish } from '@lib/redis/client'

export default async function FlushCache() {
    async function action() {
        'use server'
        return await publish('flush-cache')
    }

    return <Header action={action} />
}
