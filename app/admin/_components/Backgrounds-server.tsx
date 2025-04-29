/* Utils */
import { updateBackgrounds } from '@app/admin/_lib/updateBackgrounds'
import { getBackgrounds } from '@app/admin/_lib/getBackgrounds'
/* Components */
import { BackgroundsClient } from '@app/admin/_components/Backgrounds-client'

type Props = {
    page: number
}

export async function BackgroundsServer({ page }: Props) {
    const backgrounds = await getBackgrounds()

    const refresh = async () => {
        'use server'
        return await updateBackgrounds()
            .then(() => 'Updated')
            .catch((e) => e.message)
    }

    return (
        <BackgroundsClient
            refresh={refresh}
            page={page}
            backgrounds={backgrounds}
        />
    )
}
