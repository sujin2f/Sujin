'use server'
import type { ObjectId } from 'mongodb'
import Link from 'next/link'
import { notFound } from 'next/navigation'
/* Models */
import { NoContentError } from '@common/model/Error'
import Logger from '@common/model/Logger'
/* Components */
import { ItemClient } from '@app/recipe/_components/Item.client'
import Wrapper from '@app/_components/Wrapper'
/* Utils */
import { getCachedRecipe } from '@app/recipe/_lib/getCachedRecipe'
import { mongoStringify } from '@common/utils/object'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'

type Props = {
    id: ObjectId
}

export async function ItemServer({ id }: Props) {
    const recipe = await getCachedRecipe(id)
        .then((item) => mongoStringify(item))
        .catch((e) => {
            if (e instanceof NoContentError) {
                e.log()
                notFound()
            }
            Logger.server(e)
            throw e
        })

    return (
        <Wrapper
            menu={MENU_NAMES.MAIN}
            large={8}
            largeOffset={2}
            small={12}
            title={recipe.title}
            excerpt={
                recipe.url && (
                    <Link href={recipe.url} target="_blank">
                        {recipe.url}
                    </Link>
                )
            }
            prefix="Recipe"
        >
            <ItemClient recipe={recipe} />
        </Wrapper>
    )
}
