'use server'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'
/* Components */
import { Banner } from '@app/@banner/_components'

export default async function ListPage() {
    const user = await getUserInfo()

    return <Banner menu={user ? 'recipe-user' : 'recipe'} title="Write New Recipe" prefix="recipe" />
}
