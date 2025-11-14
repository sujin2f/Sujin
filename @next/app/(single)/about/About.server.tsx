'use server'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { SocialShare } from '@lib/components/single/SocialShare.client'
import { Content } from '@lib/components/single/Content'
/* CONSTANTS */
import { IMAGE_SIZE } from '@sujin/lib/types'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { getSingle } from '@lib/apollo/single'

export async function AboutServer() {
    const post = await getSingle('about', 'page', 'PAGE').catch(() => {})

    if (!post) {
        notFound()
    }

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
