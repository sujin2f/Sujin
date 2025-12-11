'use server'
/* Components */
import { BackgroundsClient } from '@app/next-admin/backgrounds/page.client'
/* Utils */
import { getBackgrounds } from '@app/@banner/_lib/getBackgrounds'

export default async function Backgrounds() {
    async function action() {
        'use server'
        return await getBackgrounds()
    }

    return <BackgroundsClient action={action} />
}
