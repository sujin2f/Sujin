import { Double, ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
/* Models */
import Cached from '@common/model/Cached'
import {
    A_Error,
    UnauthorizedError,
    NoContentError,
    ForbiddenError,
} from '@common/model/Error'
import Logger from '@common/model/Logger'
/* Components */
import { MutateClient } from '@app/recipe/_components/Mutate.client'
/* Utils */
import { getCachedRecipe } from '@app/recipe/_lib/getCachedRecipe'
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'
import { getCacheKey } from '@app/_lib/utils/cache'
import { insertOne, updateOne } from '@common/data/mongo/mongo'
import { mongoStringify } from '@common/utils/object'
/* CONSTANTS */
import { COLLECTION, MENU_NAMES, type T_Recipe } from '@app/_lib/types'
/* T_Type */
import type { T_Stringify } from '@common/types/mongo'
import Wrapper from '@app/_components/Wrapper'

type Props = {
    _id?: ObjectId
}

export async function MutateServer({ _id }: Props) {
    const user = await getCurrentUser().then((user) => {
        if (!user) {
            throw new ForbiddenError(
                'You need to log in for adding or modifying a recipe.',
            ).log()
        }
        return user
    })

    const recipe =
        _id &&
        (await getCachedRecipe(_id)
            .then((item) => {
                if (item.user.toString() !== user._id) {
                    throw new ForbiddenError(
                        `Invalid access: This is not your recipe`,
                        _id,
                        user._id,
                    ).log()
                }
                return mongoStringify(item)
            })
            .catch((e) => {
                if (e instanceof A_Error) {
                    throw new NoContentError(
                        'Recipe cannot be found.',
                        _id.toString(),
                    )
                        .setCause(e)
                        .log()
                }
                Logger.server(e)
                throw e
            }))

    return (
        <Wrapper
            menu={MENU_NAMES.MAIN}
            large={8}
            largeOffset={2}
            small={12}
            title={recipe ? `Edit: ${recipe.title}` : 'New Recipe'}
            excerpt=""
            prefix="Recipe"
        >
            <MutateClient mutate={mutate} recipe={recipe} user={user} />
        </Wrapper>
    )
}

const mutate = async (recipe: Partial<T_Stringify<T_Recipe>>) => {
    'use server'
    const userId = await getCurrentUser().then((user) => {
        if (!user) {
            throw new ForbiddenError(
                'You need to log in for adding or modifying a recipe.',
            ).log()
        }
        return user._id
    })

    if (recipe._id && recipe.user && recipe.user !== userId) {
        throw new UnauthorizedError(
            `Not Authorized in insertRecipe() for ${recipe._id} ${recipe.user}`,
        ).log()
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
        ).catch((e) => {
            Logger.server(e)
            throw e
        })
    } else {
        await insertOne(COLLECTION.RECIPE, {
            ...doc,
            user: new ObjectId(user),
        }).catch((e) => {
            Logger.server(e)
            throw e
        })
    }

    await Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
    revalidateTag('recipe')
}
