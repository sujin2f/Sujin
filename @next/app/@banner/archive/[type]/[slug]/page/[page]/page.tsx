'use server'
import { notFound } from 'next/navigation'
/* Model */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { ARCHIVE, MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getCategory } from '@app/_lib/graphql/getCategory'
import { getTag } from '@app/_lib/graphql/getTag'

type Props = {
    params: Promise<{
        type: string
        slug: string
        page: string
    }>
}

export default async function AboutBanner(props: Props) {
    const params = await props.params
    const slug = params.slug.toLowerCase()
    const page = parseInt(params.page)
    const type = params.type as ARCHIVE

    const archive = await (type === ARCHIVE.CATEGORY ? getCategory(slug) : getTag(slug))
        .then((result) => {
            if (!result.slug) {
                throw new Error(`🤬 Archive ${type} ${slug} ${page} request has been failed: No-content.`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            notFound()
        })
    const { title, excerpt, image } = archive

    return <Banner menu={MENU_NAMES.MAIN} title={title} excerpt={excerpt} prefix={type} background={image} />
}
