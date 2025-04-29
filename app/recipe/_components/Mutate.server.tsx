import type { ObjectId } from 'mongodb'
import { unstable_cache } from 'next/cache'
/* Models */
import { A_Error, UnauthorizedError } from '@common/model/Error'
/* Components */
import { MutateClient } from '@app/recipe/_components/Mutate.client'
/* Utils */
import { getCachedRecipe } from '@app/recipe/_lib/getCachedRecipe'
import { mutateRecipe } from '@app/recipe/_lib/mutateRecipe'
import { getCurrentUser } from '@app/_lib/data/mongo/user'
/* CONSTANTS */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* T_Type */
import type { T_Stringify } from '@common/types/mongo'
import type { T_Recipe } from '@app/_lib/types'

type Props = {
    _id: ObjectId | 'new'
}

export async function MutateServer({ _id }: Props) {
    const user = await getCurrentUser().catch((e) => {
        if (e instanceof A_Error) {
            new UnauthorizedError('You need to log in for adding a recipe.')
                .setCause(e)
                .log()
        }
        throw e
    })

    const request = unstable_cache(
        async (id: ObjectId) =>
            await getCachedRecipe(id).catch((e) => {
                if (e instanceof A_Error) {
                    e.log()
                }
                throw e
            }),
        [_id.toString(), VERSION],
        {
            tags: ['recipe', 'single'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )
    const recipe = _id === 'new' ? undefined : await request(_id)
    const mutate = async (recipe: Partial<T_Stringify<T_Recipe>>) => {
        'use server'
        await mutateRecipe(recipe).catch((e) => {
            if (e instanceof A_Error) {
                e.log()
            }
            throw e
        })
    }

    return <MutateClient mutate={mutate} recipe={recipe} user={user} />
}
