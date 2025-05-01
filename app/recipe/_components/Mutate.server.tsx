import { Double, ObjectId } from 'mongodb'
import { unstable_cache, revalidateTag } from 'next/cache'
/* Models */
import Cached from '@common/model/Cached'
import { A_Error, UnauthorizedError } from '@common/model/Error'
/* Components */
import { MutateClient } from '@app/recipe/_components/Mutate.client'
/* Utils */
import { getCachedRecipe } from '@app/recipe/_lib/getCachedRecipe'
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'
import { getCacheKey } from '@app/_lib/utils/cache'
import { insertOne, updateOne } from '@common/data/mongo/mongo'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'
import { COLLECTION, type T_Recipe } from '@app/_lib/types'
/* T_Type */
import type { T_Stringify } from '@common/types/mongo'

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
            revalidate,
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

const mutateRecipe = async (recipe: Partial<T_Stringify<T_Recipe>>) => {
    const userId = await getCurrentUser()
        .then((user) => user._id)
        .catch((e) => {
            if (e instanceof UnauthorizedError) {
                throw new UnauthorizedError('You need to ').setCause(e)
            }
            throw e
        })

    if (recipe._id && recipe.user && recipe.user !== userId) {
        throw new UnauthorizedError(
            `Not Authorized in insertRecipe() for ${recipe._id} ${recipe.user}`,
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, user, ...doc } = {
        ...recipe,
        ingredients: recipe.ingredients!.map((item) => ({
            ...item,
            amount: new Double(item.amount),
        })),
    }
    // @todo logging
    if (recipe._id) {
        await updateOne(
            COLLECTION.RECIPE,
            { _id: new ObjectId(recipe._id) },
            { $set: doc },
        )
    } else {
        await insertOne(COLLECTION.RECIPE, {
            ...doc,
            user: new ObjectId(user),
        })
    }

    await Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
    revalidateTag('recipe')
}
