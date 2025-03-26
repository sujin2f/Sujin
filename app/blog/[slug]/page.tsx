import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next/types'
/* Components */
import Banner from '@components/header/Banner'
import { Post } from '@components/wordpress/single/Post'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { BASE_URL } from '@src/constants/system'
import { MenuNames } from '@src/constants/mysql-query'
/* Utils */
import getPost from '@src/db/mongo/wordpress/getPost'
import { updateHit } from '@src/db/mysql/getTagCloud'
import { getThumbnailFromPost } from '@src/utils/wordpress'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const { slug } = await props.params
    const requestPost = unstable_cache(
        async (slug) => await getPost(slug, 'post'),
        [slug],
        {
            tags: ['wordpress', 'post'],
            revalidate: HOUR_IN_SECONDS,
        },
    )
    const post = await requestPost(slug)

    const url = `${BASE_URL}/blog/${slug}`
    const images = getThumbnailFromPost(post)
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

export default async function SinglePost(props: Props) {
    const { slug } = await props.params
    const requestPost = unstable_cache(
        async (slug) => await getPost(slug, 'post'),
        [slug],
        {
            tags: ['wordpress', 'post'],
            revalidate: HOUR_IN_SECONDS,
        },
    )
    const post = await requestPost(slug)
        .then((result) => ({
            ...result,
            _id: undefined,
        }))
        .catch(() => notFound())
    const thumbnail = getThumbnailFromPost(post)

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
