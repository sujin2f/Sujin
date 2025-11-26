'use server'
/* Components */
import { BackgroundsClient } from '@app/next-admin/backgrounds/page.client'
/* Utils */
import { backgrounds as getBackgrounds } from '@lib/apollo/queries/wordpress/backgrounds/backgrounds'

export default async function Backgrounds() {
    async function action() {
        'use server'
        return await getBackgrounds()
    }

    return <BackgroundsClient action={action} />
}
