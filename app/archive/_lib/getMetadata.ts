'use server'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { BASE_URL, revalidate } from '@app/_lib/constants'
import { ARCHIVE_URL } from '@app/_lib/types'
/* Utils */
import { getCachedArchive } from '@app/archive/_lib/getCachedArchive'

type Props = {
    type: ARCHIVE_URL
    slug: string
    page: number
}

export const getMetadata = async ({
    slug,
    type,
    page,
}: Props): Promise<Metadata> => {
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
