'use server'
/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
/* Utils */
import { getCategory } from '@app/archive/_lib/getCategory'
import { getTag } from '@app/archive/_lib/getTag'

type Props = {
    params: Promise<{
        type: string
        slug: string
        page: string
    }>
}

export default async function ArchiveBanner(props: Props) {
    const params = await props.params
    const slug = params.slug.toLowerCase()
    const type = params.type as ARCHIVE

    const archive = await (type === ARCHIVE.CATEGORY ? getCategory(slug) : getTag(slug))
    if (!archive) {
        return
    }
    const { title, excerpt, image } = archive

    return <Banner menu="primary" title={title} excerpt={excerpt} prefix={type} background={image} />
}
