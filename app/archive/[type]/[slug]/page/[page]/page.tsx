import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { unstable_cache } from 'next/cache'
/* Components */
import { SearchServer } from '@app/archive/_components/Search.server'
import { ArchiveServer } from '@app/archive/_components/Archive.server'
/* CONSTANTS */
import { ARCHIVE, ARCHIVE_URL } from '@app/_lib/types'
import { VERSION } from '@common/constants/helper'
import { BASE_URL, revalidate } from '@app/_lib/constants'
/* Utils */
import { getCachedArchive } from '@app/archive/_lib/getCachedArchive'

type Props = {
    params: Promise<{
        type: string
        slug: string
        page: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const { type, ...params } = await props.params
    const slug = params.slug.toLowerCase()
    const page = parseInt(params.page)

    if (Object.keys(ARCHIVE_URL).includes(type)) {
        return {}
    }

    if (type === ARCHIVE_URL.SEARCH) {
        return {
            title: `Sujin | Search result | ${slug}`,
            robots: {
                index: false,
                follow: false,
                nocache: false,
            },
        }
    }

    const request = unstable_cache(
        async (slug, type) => {
            return await getCachedArchive(slug, type).catch(() => null)
        },
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate,
        },
    )

    const archive = await request(slug, type)
    if (!archive) {
        return {
            robots: {
                index: false,
                follow: false,
                nocache: false,
            },
        }
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

export default async function Archive(props: Props) {
    const { type, ...params } = await props.params
    const slug = params.slug.toLowerCase()
    const page = parseInt(params.page)
    if (Object.keys(ARCHIVE_URL).includes(type)) {
        notFound()
    }

    return type === ARCHIVE.SEARCH ? (
        <SearchServer page={page} slug={slug} />
    ) : (
        <ArchiveServer page={page} type={type as ARCHIVE_URL} slug={slug} />
    )
}
