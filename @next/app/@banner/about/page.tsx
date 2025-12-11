'use server'
/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'
/* Utils */
import { getPage } from '@app/about/_lib/getPage'

export default async function AboutBanner() {
    const post = await getPage('about')
    if (!post) {
        return <></>
    }

    return (
        <Banner
            menu={MENU_NAMES.MAIN}
            excerpt={post.excerpt}
            title={post.title}
            icon={post.images?.icon}
            background={post.images?.background}
        />
    )
}
