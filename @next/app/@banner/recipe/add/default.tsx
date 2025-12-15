'use server'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'
/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default async function ListPage() {
    const user = await getUserInfo()

    return <Banner menu={user ? MENU_NAMES.RECIPE_USER : MENU_NAMES.RECIPE} title="Write New Recipe" prefix="recipe" />
}
