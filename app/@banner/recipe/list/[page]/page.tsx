'use server'
/* Utils */
import { getUserInfo } from '@app/_lib/utils/tokens'
/* Components */
import { Banner } from '@app/@banner/_components'

export default async function ListPage() {
    const user = await getUserInfo()

    return (
        <Banner
            menu={user ? 'recipe-user' : 'recipe'}
            title="Recipe List"
            excerpt="The recipe manager with measurement conversion"
            prefix="recipe"
        />
    )
}
