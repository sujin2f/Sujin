import { T_Recipe } from '@app/_lib/types'
import { List } from '@app/recipe/_components/list'
import { NewRecipe } from './new-recipe'

type Props = {
    page: number
}

export async function RecipeServer({ page }: Props) {
    // const session = await getServerSession(authOptions)
    // const userId =
    //     session?.user?.email &&
    //     (await getUser(session.user.email).then((user) =>
    //         user ? user._id : null,
    //     ))
    const addRecipe = async (recipe: Omit<T_Recipe, '_id' | 'user'>) => {
        'use server'
        console.log('addRecipe', recipe)
    }

    // const request = unstable_cache(
    //     async (my: boolean) => {
    //         'use server'
    //         return await getCachedRecipe((my && userId) || undefined)
    //     },
    //     [userId?.toString() || '', VERSION],
    //     {
    //         tags: ['recipe'],
    //         revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
    //     },
    // )

    return (
        <>
            <NewRecipe addRecipe={addRecipe} />
            <List page={page} />
        </>
    )
}
