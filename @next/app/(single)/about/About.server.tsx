'use server'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { SocialShare } from '@lib/components/single/SocialShare.client'
import { Content } from '@lib/components/single/Content'
/* CONSTANTS */
import { COLLECTION, IMAGE_SIZE, POST_TYPE } from '@sujin/lib/constants'
import POST_QUERY from '@lib/constants/gql/post.graphql'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { cachedGQLRequest } from '@lib/apollo/GQLRequest'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'

export async function AboutServer() {
    const post = await cachedGQLRequest<{ post: T_Post[] }>(
        POST_QUERY,
        { slug: 'about', type: POST_TYPE.PAGE },
        [COLLECTION.PAGE, POST_TYPE.PAGE, 'about'],
    )
        .then((result) => {
            if (!result.data || !result.data.post.length) {
                notFound()
            }
            return result.data.post[0]
        })
        .catch(() => notFound())

    const thumbnail = getThumbnailFromPost(post.images, IMAGE_SIZE.MEDIUM_LARGE)

    return (
        <Wrapper
            medium={12}
            large={8}
            largeOffset={2}
            title={post.title}
            excerpt={post.excerpt}
            icon={post.images?.icon}
            background={post.images?.background}
            backgroundColor={post.meta?.backgroundColor}
        >
            <Content post={post} type="page">
                <SocialShare
                    title={post.title}
                    excerpt={post.excerpt}
                    thumbnail={thumbnail}
                />
            </Content>
        </Wrapper>
    )
}
