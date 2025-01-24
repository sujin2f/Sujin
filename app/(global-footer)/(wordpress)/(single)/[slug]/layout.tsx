import { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { redirect } from 'next/navigation'
import { getPost } from '@src/db/mongo/wordpress/post'
import { removeId } from '@src/db/mongo/util'
import { Page } from '@components/(wordpress)/single/Page'
import { unstable_cache } from 'next/cache'
import { DAY_IN_SECONDS } from '@common/constants/datetime'

const getPageParams = async ({ params }: PageProps) => {
    const { slug } = await params
    return slug
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
    const slug = await getPageParams(props)

    const requestPost = unstable_cache(
        async (slug) => await getPost(slug),
        [slug],
        {
            tags: ['wordpress', 'page'],
            revalidate: DAY_IN_SECONDS,
        },
    )
    const post = await requestPost(slug)
    if (!post) {
        return {}
    }

    const pathname = `/${slug}`
    const url = `${process.env.BASE_URL}${pathname}`
    const images =
        post.images.thumbnail?.url ||
        post.images.list?.url ||
        `${process.env.BASE_URL}/thumbnail.png`
    const keywords = post.tags.map((tag) => tag.title)

    return {
        title: `Sujin | ${post.title}`,
        description: post.excerpt,
        keywords,
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
    const requestPost = unstable_cache(
        async (slug) => await getPost(slug),
        [slug],
        {
            tags: ['wordpress', 'page'],
            revalidate: DAY_IN_SECONDS,
        },
    )

    const post = await requestPost(slug)
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
