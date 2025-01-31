import type { Metadata } from 'next/types'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { getPost } from '@src/db/mysql/getPost'
import { Page } from '@components/(wordpress)/single/Page'
import { unstable_cache } from 'next/cache'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import NotFound from '@app/not-found'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    },
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/about`),
}

export default async function Layout() {
    const requestPost = unstable_cache(
        async () => await getPost('about'),
        ['about'],
        {
            tags: ['wordpress', 'page'],
            revalidate: HOUR_IN_SECONDS,
        },
    )

    let post

    try {
        post = await requestPost()
    } catch {
        return NotFound()
    }

    const thumbnail =
        (post && (post.images.list?.url || post.images.thumbnail?.url)) ||
        '/assets/thumbnail.png'

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

            <Page post={post} thumbnail={thumbnail} />
        </main>
    )
}
