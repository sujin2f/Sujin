import { cache, PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import { Page } from '@app/(global-footer)/(wordpress)/(single)/[slug]/page'
import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { redirect } from 'next/navigation'
import { getPost } from '@src/db/mongo/wordpress/post'
import { removeId } from '@src/db/mongo/util'

export const getPageParams = async ({ params }: PageProps) => {
    const { slug } = await params
    return slug
}

const getPostCached = cache(async (slug: string) => await getPost(slug))

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
    const slug = await getPageParams(props)
    const post = await getPostCached(slug)
    const pathname = `/${slug}`
    const url = `${process.env.BASE_URL}${pathname}`
    const images =
        post.images.thumbnail?.url ||
        post.images.list?.url ||
        `${process.env.BASE_URL}/thumbnail.png`

    return {
        title: `Sujin | ${post.title}`,
        description: post.excerpt,
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | ${post.title}`,
            url: url,
            images,
        },
        metadataBase: new URL(url),
    }
}

export default async function Layout(props: PropsWithChildren<PageProps>) {
    const slug = await getPageParams(props)
    const post = await getPostCached(slug)

    if (!post) {
        redirect('/404')
    }

    const thumbnail =
        (post && (post.images.list?.url || post.images.thumbnail?.url)) ||
        '/thumbnail.png'

    return (
        <>
            <Banner
                menu={MenuNames.MAIN}
                banner={{
                    title: post.title,
                    excerpt: post.excerpt,
                    icon: post.images.icon,
                    prefix: undefined,
                    background: post.images.background,
                    backgroundColor: post.meta.backgroundColor,
                }}
                className=""
            />

            <Page post={removeId(post)} thumbnail={thumbnail} />
        </>
    )
}
