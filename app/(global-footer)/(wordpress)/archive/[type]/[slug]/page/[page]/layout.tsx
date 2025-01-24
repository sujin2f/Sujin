import { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { redirect } from 'next/navigation'
import { getTerm } from '@src/db/mongo/wordpress/term'
import { TermTypes } from '@src/types/wordpress'
import { Archive } from '@components/(wordpress)/archive/Archive'
import { unstable_cache } from 'next/cache'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from '@common/constants/datetime'
import { removeId } from '@src/db/mongo/util'

export const generateMetadata = async (
    props: ArchiveProps,
): Promise<Metadata> => {
    const { type, slug, page } = await props.params
    const requestArchive = unstable_cache(
        async (type, slug, page) => await getTerm(type, slug, page),
        [type, slug, page],
        {
            tags: ['wordpress', 'archive'],
            revalidate: DAY_IN_SECONDS,
        },
    )
    const archive = await requestArchive(
        type as TermTypes,
        slug,
        parseInt(page),
    ).catch(() => undefined)
    if (!archive || archive.posts.length === 0) {
        return {}
    }
    const url = `${process.env.BASE_URL}/archive/${type}/${slug}/page/${page}`
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

export default async function Layout(props: PropsWithChildren<ArchiveProps>) {
    const { type, slug, page } = await props.params
    const requestArchive = unstable_cache(
        async (type, slug, page) => await getTerm(type, slug, page),
        [type, slug, page],
        {
            tags: ['wordpress', 'archive'],
            revalidate: HOUR_IN_SECONDS,
        },
    )

    const archive = await requestArchive(
        type as TermTypes,
        slug,
        parseInt(page),
    ).catch(() => undefined)
    if (!archive) {
        return redirect('/404')
    }
    const { title, excerpt, image } = archive
    return (
        <>
            <Banner
                menu={MenuNames.MAIN}
                banner={{
                    title: title,
                    excerpt: excerpt,
                    icon: undefined,
                    prefix: type,
                    background: image,
                    backgroundColor: undefined,
                }}
                className=""
            />

            <Archive term={removeId(archive)} />
        </>
    )
}
