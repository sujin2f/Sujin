import type { Metadata } from 'next/types'
/* Components */
import { PostServer } from '@app/(single)/blog/[slug]/Post.server'
/* CONSTANTS */
import { BASE_URL } from '@lib/constants'
import { IMAGE_SIZE, T_Post } from '@sujin/lib/types'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { getSingle } from '@lib/apollo/single'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params
    const slug = params.slug.toLowerCase()
    const post = await getSingle<T_Post>(slug, 'post', 'SINGLE_META').catch(
        () => undefined,
    )
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
