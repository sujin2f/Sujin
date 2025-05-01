/* Components */
import { BackgroundsClient } from '@app/admin/_components/Backgrounds-client'
/* CONSTANTS */
import { COLLECTION } from '@app/_lib/types'
/* T_Types */
import type { T_Background } from '@app/_lib/types'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { updateBackgrounds } from '@app/admin/_lib/updateBackgrounds'

type Props = {
    page: number
}

export async function BackgroundsServer({ page }: Props) {
    const backgrounds = await getAllBackgrounds()

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

const getAllBackgrounds = async (page: number = 1): Promise<T_Background[]> => {
    const collection = await getCollection<T_Background>(COLLECTION.BACKGROUNDS)
    return await collection
        .aggregate<T_Background>([
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
        ])
        .toArray()
}
