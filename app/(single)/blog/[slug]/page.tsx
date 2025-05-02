import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next/types'
/* Components */
import { PostServer } from '@app/(single)/_components/Post.server'
/* CONSTANTS */
import { BASE_URL } from '@app/_lib/constants'
import { VERSION } from '@common/constants/helper'
import { IMAGE_SIZE } from '@app/_lib/types'
/* Utils */
import { getThumbnailFromPost } from '@app/_lib/utils/clients'
import { revalidate } from '@app/_lib/constants'
import { getCachedPost } from '@app/(single)/_lib/getCachedPost'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params
    const slug = params.slug.toLowerCase()
    const request = unstable_cache(
        async (slug) => await getCachedPost(slug).catch(() => undefined),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post'],
            revalidate,
        },
    )
    const post = await request(slug)
    if (!post) {
        return {}
    }

    const url = `${BASE_URL}/blog/${slug}`
    const images = getThumbnailFromPost(post.images, IMAGE_SIZE.MEDIUM_LARGE)
    const keywords = post.archives.map((term) => term.title)

    return {
        title: `Sujin | ${post.title}`,
        description: post.excerpt,
        keywords,
        openGraph: {
            title: `Sujin | ${post.title}`,
            url: url,
            images,
        },
    }
}

export default async function PostPage(props: Props) {
    const params = await props.params
    const slug = params.slug.toLowerCase()

    return <PostServer slug={slug} />
}
