import type { Metadata } from 'next/types'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
/* Components */
import Banner from '@components/header/Banner'
import { Page } from '@components/wordpress/single/Page'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { BASE_URL } from '@src/constants/system'
import { MenuNames } from '@src/constants/mysql-query'
/* Utils */
import getPost from '@src/db/mongo/wordpress/getPost'
import { getThumbnailFromPost } from '@src/utils/wordpress'
import { mongoIdToString } from '@common/utils/object'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${BASE_URL}/about`,
    },
    metadataBase: new URL(`${BASE_URL}/about`),
}

export default async function About() {
    const requestPost = unstable_cache(
        async () => await getPost('about', 'page'),
        ['about'],
        {
            tags: ['wordpress', 'page'],
            revalidate: HOUR_IN_SECONDS,
        },
    )

    const post = await requestPost().catch(() => notFound())
    const thumbnail = getThumbnailFromPost(post)

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

            <Page post={mongoIdToString(post)[0]} thumbnail={thumbnail} />
        </main>
    )
}
