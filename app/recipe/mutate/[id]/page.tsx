import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
/* Components */
import { MutateRecipeClient } from '@app/recipe/mutate/[id]/mutate.client'
/* Utils */
import { getCachedRecipe, insertRecipe } from '@app/_lib/data/mongo/recipe'
import { getUser } from '@app/_lib/data/mongo/user'
/* CONSTANTS */
import { authOptions } from '@app/api/auth/constants'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* T_Types */
import type { T_Recipe } from '@app/_lib/types'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function MutateRecipe(props: Props) {
    // User
    const session = await getServerSession(authOptions)
    const userId = await getUser(session?.user?.email || '').then((user) => {
        if (!user) notFound()
        return user._id.toString()
    })

    // Params
    const { id } = await props.params
    const request = unstable_cache(
        async (id) => await getCachedRecipe(new ObjectId(id)),
        [id.toString(), VERSION],
        {
            tags: ['recipe', 'single'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )
    const recipe = id === 'new' ? undefined : request(id)

    const addRecipe = async (recipe: Partial<T_Recipe>) => {
        'use server'
        if (!userId) {
            throw Error('')
        }
        await insertRecipe(recipe)
    }

    return <MutateRecipeClient addRecipe={addRecipe} recipe={recipe} />
}
