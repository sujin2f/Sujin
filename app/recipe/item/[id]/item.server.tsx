import { notFound } from 'next/navigation'
/* Components */
import { ItemClient } from '@app/recipe/item/[id]/item.client'
/* T_Types */
import type { T_Recipe } from '@app/_lib/types'

type Props = {
    readonly request: Promise<T_Recipe | null>
}

export async function ItemServer({ request }: Props) {
    const recipe = await request
    if (!recipe) {
        notFound()
    }
    return (
        <>
            <ItemClient recipe={recipe} />
        </>
    )
}
