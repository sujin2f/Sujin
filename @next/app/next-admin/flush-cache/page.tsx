'use server'
/* Components */
import { Header } from '@app/next-admin/flush-cache/Header'
/* Utils */
import { flushCache } from '@lib/utils/server/actions'

export default async function Backgrounds() {
    async function action() {
        'use server'
        return await flushCache()
    }

    return <Header action={action} />
}
