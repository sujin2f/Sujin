import { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { getPost } from '@src/db/mysql/getPost'
import { updateHit } from '@src/db/mysql/getTagCloud'
import { Post } from '@components/(wordpress)/single/Post'
import { unstable_cache } from 'next/cache'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import NotFound from '@app/not-found'

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
    const { slug } = await props.params
    const requestPost = unstable_cache(
        async (slug) => await getPost(slug),
        [slug],
        {
            tags: ['wordpress', 'post'],
            revalidate: HOUR_IN_SECONDS,
        },
    )

    let post

    try {
        post = await requestPost(slug)
    } catch {
        return {}
    }

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`
    const images =
        post.images.thumbnail?.url ||
        post.images.list?.url ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/assets/thumbnail.png`
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
    const { slug } = await props.params
    const requestPost = unstable_cache(
        async (slug) => await getPost(slug),
        [slug],
        {
            tags: ['wordpress', 'post'],
            revalidate: HOUR_IN_SECONDS,
        },
    )

    let post

    try {
        post = await requestPost(slug)
    } catch {
        return NotFound()
    }

    const thumbnail =
        (post && (post.images.list?.url || post.images.thumbnail?.url)) ||
        '/assets/thumbnail.png'

    // Update Tag Cloud
    if (post.tags.length) {
        post.tags.forEach((tag) => updateHit(tag.id))
    }
    return (
        <main>
            <Banner
                menu={MenuNames.MAIN}
                banner={{
                    title: post.title,
                    excerpt: post.excerpt,
                    icon: post.images.icon,
                    background: post.images.background,
                    backgroundColor: post.meta.backgroundColor,
                }}
            />
            <Post post={post} thumbnail={thumbnail} />
        </main>
    )
}
