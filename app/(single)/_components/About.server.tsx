import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
/* Models */
import { A_Error, NoContentError } from '@common/model/Error'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { SocialShare } from '@app/(single)/_components/SocialShare.client'
import { Content } from '@app/(single)/_components/Content'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { IMAGE_SIZE } from '@app/_lib/types'
import { revalidate } from '@app/_lib/constants'
/* Utils */
import { getThumbnailFromPost } from '@app/_lib/data/mysql/utils'
import { getCachedPage } from '@app/(single)/_lib/getCachedPage'

export async function AboutServer() {
    const request = unstable_cache(
        async () =>
            await getCachedPage('about').catch((e) => {
                if (e instanceof NoContentError) {
                    e.log()
                    notFound()
                }
                if (e instanceof A_Error) {
                    e.log()
                }
                throw e
            }),
        ['about', VERSION],
        {
            tags: ['wordpress', 'page'],
            revalidate,
        },
    )

    const post = await request()
    const thumbnail = getThumbnailFromPost(post.images, IMAGE_SIZE.MEDIUM_LARGE)

    return (
        <Wrapper
            className="wrapper--page--about sujin"
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
