'use server'
/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'

export default async function DefaultBanner() {
    const user = await getUserInfo()
    return (
        <Banner
            menu={user ? MENU_NAMES.RECIPE_USER : MENU_NAMES.RECIPE}
            excerpt="The recipe manager with measurement conversion"
            title="Recipe"
        />
    )
}
