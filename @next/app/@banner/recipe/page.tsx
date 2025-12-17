'use server'
/* Components */
import { Banner } from '@app/@banner/_components'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'

export default async function DefaultBanner() {
    const user = await getUserInfo()
    return (
        <Banner
            menu={user ? 'recipe-user' : 'recipe'}
            excerpt="The recipe manager with measurement conversion"
            title="Recipe"
        />
    )
}
