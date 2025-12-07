'use server'
import { notFound } from 'next/navigation'
/* Model */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getPage } from '@app/_lib/graphql/getPage'

export default async function AboutBanner() {
    console.log('AboutBanner')
    const post = await getPage('about')
        .then((result) => {
            if (!result.slug) {
                throw new Error(`🤬 Page about request has been failed: No-content.`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            notFound()
        })

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
