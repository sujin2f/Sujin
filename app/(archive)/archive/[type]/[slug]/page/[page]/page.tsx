import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { unstable_cache } from 'next/cache'
/* Components */
// import Archive from './Archive'
import { SearchServer } from '@app/(archive)/archive/search-server'
import { ArchiveServer } from '@app/(archive)/archive/archive-server'
/* CONSTANTS */
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { ARCHIVE, ARCHIVE_URL } from '@app/_lib/types'
import { BASE_URL } from '@app/_lib/constants'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Utils */
import {
    categoryFormatter,
    getCachedArchive,
} from '@app/_lib/data/mongo/wordpress/archive'
/* Types */
import type { ArchiveProp } from '@app/(archive)/types'

type Props = {
    params: Promise<ArchiveProp>
}

export const generateMetadata = async ({
    params,
}: Props): Promise<Metadata> => {
    // Param
    const { page, type, slug: title } = await params
    const slug = title.toLowerCase()
    if (Object.keys(ARCHIVE_URL).includes(type)) {
        return {}
    }

    if (type === ARCHIVE_URL.SEARCH) {
        return {
            title: `Sujin | Search result | ${title}`,
            robots: {
                index: false,
                follow: false,
                nocache: false,
            },
        }
    }

    const requestArchive = unstable_cache(
        async (slug) => await getCachedArchive(slug, type, categoryFormatter),
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
    }
}

export default async function Page({ params }: Props) {
    const { page, type, slug: title } = await params
    const slug = title.toLowerCase()
    if (Object.keys(ARCHIVE_URL).includes(type)) {
        notFound()
    }

    if (type === ARCHIVE.SEARCH) {
        return <SearchServer page={page} type={type} slug={slug} />
    }

    return <ArchiveServer page={page} type={type} slug={slug} />
}
