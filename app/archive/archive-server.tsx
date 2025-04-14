import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
/* Components */
import ArchiveClient from '@app/_components/archive'
import Wrapper from '@app/_components/Wrapper'
/* CONSTANTS */
import { IS_DEV, VERSION } from '@common/constants/helper'
import { ARCHIVE, type ArchiveProp } from '@app/_lib/types'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { BASE_URL } from '@app/_lib/constants'
/* Utils */
import { getCachedArchive } from '@app/_lib/data/mongo/wordpress/archive'
import { updateHits } from '@app/_lib/data/mongo/wordpress/tag'

export const getMetadata = async ({
    page,
    type,
    slug: title,
}: ArchiveProp): Promise<Metadata> => {
    // Param
    const slug = title.toLowerCase()

    const requestArchive = unstable_cache(
        async () => {
            return await getCachedArchive(slug, type, page)
        },
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: IS_DEV ? false : HOUR_IN_SECONDS,
        },
    )

    return await requestArchive()
        .then((archive) => {
            const url = `${BASE_URL}/archive/${type}/${slug}/page/${page}`

            return {
                title: `Sujin | ${archive.title}`,
                description: archive.excerpt,
                openGraph: {
                    title: `Sujin | ${archive.title}`,
                    url: url,
                },
            }
        })
        .catch(() => ({}))
}

export async function ArchiveServer({ page, type, slug }: ArchiveProp) {
    const requestArchive = unstable_cache(
        async () => {
            return await getCachedArchive(slug, type, page)
        },
        [type, slug, page.toString(), VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: IS_DEV ? false : HOUR_IN_SECONDS,
        },
    )
    const archive = await requestArchive()
        .then((archive) => {
            if (!archive.posts || archive.posts.length === 0) {
                notFound()
            }
            return archive
        })
        .catch(() => notFound())
    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        updateHits(slug)
    }

    return (
        <Wrapper
            title={title}
            excerpt={excerpt}
            prefix={type}
            background={image}
        >
            <ArchiveClient
                type={type}
                slug={slug}
                page={page}
                total={archive.total}
                posts={archive.posts!}
            />
        </Wrapper>
    )
}
