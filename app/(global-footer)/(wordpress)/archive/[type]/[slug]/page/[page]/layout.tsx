import { cache, PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { redirect } from 'next/navigation'
import { getTerm } from '@src/db/mongo/wordpress/term'
import { TermTypes } from '@src/types/wordpress'
import { Archive } from '@components/(wordpress)/archive/Archive'

const getArchiveCached = cache(
    async (type: TermTypes, slug: string, page: number) =>
        await getTerm(type, slug, page),
)

export const generateMetadata = async (
    props: ArchiveProps,
): Promise<Metadata> => {
    const { type, slug, page } = await props.params
    const archive = await getArchiveCached(
        type as TermTypes,
        slug,
        parseInt(page),
    ).catch(() => undefined)
    if (!archive || archive.posts.length === 0) {
        return {}
    }
    const url = `${process.env.BASE_URL}/archive/${type}/${slug}/page/${page}`

    return {
        title: `Sujin | ${archive.title}`,
        description: archive.excerpt,
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | ${archive.title}`,
            url: url,
        },
        metadataBase: new URL(url),
    }
}

export default async function Layout(props: PropsWithChildren<ArchiveProps>) {
    const { type, slug, page } = await props.params
    const archive = await getArchiveCached(
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

            <Archive term={archive} />
        </>
    )
}
