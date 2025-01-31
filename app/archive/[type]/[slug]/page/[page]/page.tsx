import { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { getTermBy } from '@src/db/mysql/getTermBy'
import { TermTypes } from '@src/types/wordpress'
import { Archive } from '@components/(wordpress)/archive/Archive'
import { unstable_cache } from 'next/cache'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from '@common/constants/datetime'
import NotFound from '@app/not-found'

export const generateMetadata = async (
    props: ArchiveProps,
): Promise<Metadata> => {
    const { type, slug, page } = await props.params
    const requestArchive = unstable_cache(
        async (type, slug, page) => await getTermBy(type, slug, page),
        [type, slug, page],
        {
            tags: ['wordpress', 'archive'],
            revalidate: DAY_IN_SECONDS,
        },
    )

    let archive
    try {
        archive = await requestArchive(type as TermTypes, slug, parseInt(page))
    } catch {
        return {}
    }

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/archive/${type}/${slug}/page/${page}`
    const keywords = archive.posts
        .map((post) => post.tags.map((tag) => tag.title))
        .flat()

    return {
        title: `Sujin | ${archive.title}`,
        description: archive.excerpt,
        keywords,
        openGraph: {
            title: `Sujin | ${archive.title}`,
            url: url,
        },
        metadataBase: new URL(url),
    }
}

export default async function ArchivePage(
    props: PropsWithChildren<ArchiveProps>,
) {
    const { type, slug, page } = await props.params
    const requestArchive = unstable_cache(
        async (type, slug, page) => await getTermBy(type, slug, page),
        [type, slug, page],
        {
            tags: ['wordpress', 'archive'],
            revalidate: HOUR_IN_SECONDS,
        },
    )

    let archive
    try {
        archive = await requestArchive(type as TermTypes, slug, parseInt(page))
    } catch {
        return NotFound()
    }

    const { title, excerpt, image } = archive
    return (
        <main>
            <Banner
                menu={MenuNames.MAIN}
                banner={{
                    title: title,
                    excerpt: excerpt,
                    prefix: type,
                    background: image,
                }}
            />

            <Archive term={archive} />
        </main>
    )
}
