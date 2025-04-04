import type { Metadata } from 'next/types'
import { unstable_cache } from 'next/cache'
/* Components */
import Archive from './Archive'
/* Constants */
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { ARCHIVE } from '@app/_lib/data/mysql/types'
import { BASE_URL } from '@app/_lib/constants'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Utils */
import { getCachedCategory } from '@app/_lib/data/mongo/wordpress/category'
import { getCachedTag } from '@app/_lib/data/mongo/wordpress/tag'
/* Types */
import type { ArchiveProp } from '@app/(archive)/types'

type Props = {
    params: Promise<ArchiveProp>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params
    const { slug, page } = params
    const type = params.type === 'tag' ? ARCHIVE.CATEGORY : params.type
    const requestArchive = unstable_cache(
        async (slug) =>
            type === ARCHIVE.CATEGORY
                ? await getCachedCategory(slug)
                : await getCachedTag(slug),
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: IS_DEV ? false : DAY_IN_SECONDS,
        },
    )

    const archive = await requestArchive(slug).catch(() => null)
    if (!archive) {
        return {}
    }
    const url = `${BASE_URL}/archive/${type}/${slug}/page/${page}`

    return {
        title: `Sujin | ${archive.title}`,
        description: archive.excerpt,
        openGraph: {
            title: `Sujin | ${archive.title}`,
            url: url,
        },
        metadataBase: new URL(url),
    }
}

export default async function Page(props: Props) {
    return <Archive {...props} />
}
