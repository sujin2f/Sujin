import { ObjectId } from 'mongodb'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
/* Components */
import { ItemClient } from '@app/recipe/item/[id]/item.client'
/* Utils */
import { getCachedRecipe } from '@app/_lib/data/mongo/recipe'
/* CONSTANTS */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* T_Types */
import type { T_Recipe } from '@app/_lib/types'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function ListRecipe({ params }: Props) {
    const { id } = await params

    const request = unstable_cache(
        async (id) => await getCachedRecipe(id),

        [id, VERSION],
        {
            tags: ['recipe', 'single'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    const recipe = await request(new ObjectId(id))
        .then((result) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _id, user, ...recipe } = result
            return recipe as T_Recipe
        })
        .catch(() => notFound())
    if (!recipe) {
        notFound()
    }

    return <ItemClient recipe={recipe} />
}
