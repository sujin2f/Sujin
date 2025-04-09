/* Utils */
import {
    getBackgrounds,
    updateBackgrounds,
} from '@app/_lib/data/mongo/wordpress/background'
/* Components */
import { ClientComponent } from '@app/admin/backgrounds/backgrounds-client'

type Props = {
    page: string
}

export async function ServerComponent(props: Props) {
    const page = parseInt(props.page)
    const backgrounds = await getBackgrounds()

    const refresh = async () => {
        'use server'
        return await updateBackgrounds().catch((e) => e.message)
    }

    return (
        <ClientComponent
            refresh={refresh}
            page={page}
            backgrounds={backgrounds}
        />
    )
}
