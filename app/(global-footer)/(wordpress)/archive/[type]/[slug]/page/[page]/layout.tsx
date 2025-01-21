import { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { getArchivePageData } from '@app/(global-footer)/(wordpress)/util'
import { redirect } from 'next/navigation'

export const generateMetadata = async (
    props: ArchiveProps,
): Promise<Metadata> => {
    const { type, slug, page } = await props.params
    const archive = await getArchivePageData(props)
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
    const archive = await getArchivePageData(props)
    if (!archive) {
        return redirect('/404')
    }
    const { title, excerpt, type, image } = archive
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

            {props.children}
        </>
    )
}
