'use server'
import type { ObjectId } from 'mongodb'
/* Models */
import { NoContentError } from '@common/model/Error'
/* Components */
import { ItemClient } from '@app/recipe/_components/Item.client'
/* Utils */
import { getCachedRecipe } from '@app/recipe/_lib/getCachedRecipe'
import Logger from '@common/model/Logger'
import { mongoStringify } from '@common/utils/object'
import { notFound } from 'next/navigation'
import Wrapper from '@app/_components/Wrapper'
import { MENU_NAMES } from '@app/_lib/types'
import Link from 'next/link'

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
