import type { Metadata } from 'next/types'
/* Components */
import { PostServer } from '@app/(single)/blog/[slug]/Post.server'
/* CONSTANTS */
import { BASE_URL } from '@lib/constants'
import { POST_TYPE, IMAGE_SIZE, COLLECTION } from '@sujin/lib/constants'
import POST_QUERY from '@lib/apollo/gql/post.metadata.graphql'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { cachedGQLRequest } from '@lib/apollo/GQLRequest'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params
    const slug = params.slug.toLowerCase()

    const post = await cachedGQLRequest<{ post: T_Post[] }>(
        POST_QUERY,
        { slug, type: POST_TYPE.POST },
        [COLLECTION.POST, POST_TYPE.POST, slug, 'metadata'],
    )
        .then((result) => {
            if (!result || !result.data) {
                return
            }
            return result.data.post[0]
        })
        .catch(() => undefined)

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
