/* Components */
import ListRecipe from '@app/recipe/[page]/page'
/* Utils */
import { getLoggedInUser } from '@app/_lib/data/mongo/user'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function ListMineRecipe({ params }: Props) {
    const userId = (await getLoggedInUser())._id.toString()

    return <ListRecipe params={params} userId={userId} />
}
