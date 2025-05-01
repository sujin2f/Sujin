import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { ObjectId } from 'mongodb'
/* Models */
import { A_Error, NoContentError } from '@common/model/Error'
/* Components */
import { ItemClient } from '@app/recipe/_components/Item.client'
/* Utils */
import { getCachedRecipe } from '@app/recipe/_lib/getCachedRecipe'
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'
import { deleteRecipe } from '@app/recipe/_lib/deleteRecipe'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'
import sanitize from 'mongo-sanitize'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function ItemPage(props: Props) {
    const params = await props.params
    const _id = new ObjectId(sanitize(params.id))
    const user = await getCurrentUser().catch(() => undefined)

    const request = unstable_cache(
        async (_id: ObjectId) =>
            await getCachedRecipe(_id).catch((e) => {
                if (e instanceof NoContentError) {
                    e.log()
                    notFound()
                }
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

    const recipe = await request(_id)
    const remove = async (id: string) => {
        'use server'
        await deleteRecipe(new ObjectId(id)).catch((e) => {
            if (e instanceof A_Error) {
                e.log()
            }
            throw e
        })
    }

    return <ItemClient recipe={recipe} user={user} remove={remove} />
}
