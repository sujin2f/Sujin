import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
/* Components */
import Banner from '@components/header/Banner'
import { Archive as ArchiveComponent } from '@components/wordpress/archive/Archive'
/* Helpers */
import { getTermBy } from '@src/db/mysql/getTermBy'
import { TermTypes } from '@src/constants/wordpress'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from '@common/constants/datetime'
import { BASE_URL } from '@src/constants/system'
import { MenuNames } from '@src/constants/mysql-query'

type Props = {
    params: Promise<{
        type: string
        slug: string
        page: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const { type, slug, page } = await props.params
    const requestArchive = unstable_cache(
        async (type, slug, page) => await getTermBy(type, slug, page),
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
    )
    const url = `${BASE_URL}/archive/${type}/${slug}/page/${page}`
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

export default async function Archive(props: Props) {
    const { type, slug, page } = await props.params
    const requestArchive = unstable_cache(
        async (type, slug, page) => await getTermBy(type, slug, page),
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
    ).catch(() => notFound())
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

            <ArchiveComponent term={archive} />
        </main>
    )
}
