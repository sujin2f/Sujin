'use server'
import { gql } from '@apollo/client'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
/* Models */
import { NoContentError } from '@sujin/share/model/Error'
import { client } from '@lib/apollo/server-client'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { SocialShare } from '@app/(single)/_components/SocialShare.client'
import { Content } from '@app/(single)/_components/Content'
/* CONSTANTS */
import { VERSION } from '@sujin/share/constants/helper'
import { REVALIDATION } from '@lib/constants'
import { IMAGE_SIZE, COLLECTION, type T_Page } from '@sujin/lib/types'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'

export async function AboutServer() {
    const post = await getAboutPage()

    if (!post) {
        new NoContentError(`Could not find the page -- about`).log()
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

const getAboutPage = async () => {
    const request = unstable_cache(cached, ['about', VERSION], {
        tags: ['wordpress', 'page'],
        revalidate: REVALIDATION,
    })
    return await request('about')
}

/**
 * Get single page by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Page>} - The post object
 */
const cached = async (slug: string): Promise<T_Page | null> => {
    const request = cachedRequest(query, getCacheKey(COLLECTION.PAGE, slug))
    return await request(slug)
}

const query = async (slug: string): Promise<T_Page | null> => {
    return await client
        .query<{ post: T_Page }>({
            query: gql`
                query Post($slug: String!, $type: String!) {
                    post(slug: $slug, type: $type) {
                        id
                        title
                        slug
                        content
                        link
                        meta {
                            backgroundColor
                        }
                    }
                }
            `,
            variables: {
                slug,
                type: 'page',
            },
        })
        .then((result) => {
            if (!result || !result.data) {
                return null
            }
            return result.data.post
        })
}
