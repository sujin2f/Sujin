import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { SocialShare } from '@lib/components/single/SocialShare.client'
import { Content } from '@lib/components/single/Content'
/* CONSTANTS */
import { BASE_URL } from '@lib/constants'
import { COLLECTION, IMAGE_SIZE } from '@sujin/lib/constants'
import PAGE_QUERY from '@lib/apollo/queries/wordpress/pages/page.graphql'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { cachedGQLRequest } from '@lib/apollo/queries/GQLRequest'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${BASE_URL}/about`,
    },
}

export default async function AboutPage() {
    const post = await cachedGQLRequest<{ page: T_Post }>(
        PAGE_QUERY,
        { slug: 'about' },
        [COLLECTION.PAGE, 'about'],
    )
        .then((result) => {
            if (!result.data || !result.data.page) {
                notFound()
            }
            return result.data.page
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
