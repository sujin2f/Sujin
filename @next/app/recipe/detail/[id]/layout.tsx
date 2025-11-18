import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* CONSTANTS */
import { COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
import RECIPE_QUERY from '@lib/apollo/gql/recipe.graphql'
/* Utils */
import { getSession } from '@lib/utils/session'
import { cachedGQLRequest } from '@lib/apollo/queries/GQLRequest'
import { T_Recipe } from '@sujin/lib/types'
import { Detail } from './Detail'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function RecipeDetailLayout({ params }: Props) {
    const { id } = await params

    const session = await getSession()
    const loggedIn = session && session.user

    const recipe = await cachedGQLRequest<{ recipe: T_Recipe[] }>(
        RECIPE_QUERY,
        { id },
        [COLLECTION.RECIPE, id],
    )
        .then((result) => {
            if (!result || !result.data || !result.data.recipe.length) {
                notFound()
            }

            return result.data.recipe[0]
        })
        .catch(() => notFound())

    return (
        <>
            <Banner
                menu={loggedIn ? MENU_NAMES.RECIPE_USER : MENU_NAMES.RECIPE}
                title={recipe.title}
                excerpt={recipe.url}
            />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    <Detail recipe={recipe} />
                </Column>
            </Row>
        </>
    )
}
