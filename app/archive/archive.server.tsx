import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
/* Components */
import { CardsServer } from '@app/_components/archive/cards.server'
import Wrapper from '@app/_components/Wrapper'
import { Loading } from '@app/_components/archive/loading'
/* CONSTANTS */
import { IS_DEV, VERSION } from '@common/constants/helper'
import { ARCHIVE, type ArchiveProp } from '@app/_lib/types'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { BASE_URL } from '@app/_lib/constants'
/* Utils */
import { getCachedArchive } from '@app/_lib/data/mongo/wordpress/archive'
import { updateHits } from '@app/_lib/data/mongo/wordpress/tag'
import { getCachedPosts } from '@app/_lib/data/mongo/wordpress/post'

export const getMetadata = async ({
    page,
    type,
    slug: title,
}: ArchiveProp): Promise<Metadata> => {
    // Param
    const slug = title.toLowerCase()

    const request = unstable_cache(
        async () => {
            return await getCachedArchive(slug, type)
        },
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    const archive = await request().catch(() => null)
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

export async function ArchiveServer({ page, type, slug }: ArchiveProp) {
    const requestArchive = unstable_cache(
        async () => {
            return await getCachedArchive(slug, type)
        },
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    const archive = await requestArchive().catch(() => notFound())
    if (!archive.total) notFound()

    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        updateHits(archive.slug)
    }

    const requestPosts = unstable_cache(
        async (archive) => {
            return await getCachedPosts(archive, page)
        },
        [type, slug, page.toString(), VERSION],
        {
            tags: ['wordpress', 'archive', 'posts'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    return (
        <Wrapper
            className="wrapper--archive sujin"
            title={title}
            excerpt={excerpt}
            prefix={type}
            background={image}
        >
            <Suspense fallback={<Loading />}>
                <CardsServer
                    keyPrefix={`${type}-${slug}-${page}`}
                    posts={requestPosts(archive)}
                    page={page}
                    pageURLPrefix={`/${type}/${slug}/page`}
                    large={4}
                    medium={6}
                    small={12}
                />
            </Suspense>
        </Wrapper>
    )
}
