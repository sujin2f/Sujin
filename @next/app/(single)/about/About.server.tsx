'use server'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { SocialShare } from '@lib/components/single/SocialShare.client'
import { Content } from '@lib/components/single/Content'
/* CONSTANTS */
import { IMAGE_SIZE, POST_IMAGE_LOCATION } from '@sujin/lib/types'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { getSingle } from '@lib/apollo/single'
import { IMAGE, PAGE } from '@lib/constants/graphql-fields'

const fields = `${PAGE}
    images {
        ${POST_IMAGE_LOCATION.ICON} {
            url
        }
        ${POST_IMAGE_LOCATION.BACKGROUND} {
            ${IMAGE}
            sizes {
                ${IMAGE_SIZE.MEDIUM} { ${IMAGE} }
                ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
                ${IMAGE_SIZE.LARGE} { ${IMAGE} }
            }
        }
        ${POST_IMAGE_LOCATION.LIST} {
            sizes {
                ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
            }
        }
        ${POST_IMAGE_LOCATION.THUMBNAIL} {
            sizes {
                ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
            }
        }
    }
`

export async function AboutServer() {
    const post = await getSingle('about', 'page', fields).catch(() => {})

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
