import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { SocialShare } from '@app/_components/single/SocialShare'
import { Content } from '@app/_components/single/Content'
/* CONSTANTS */
import { BASE_URL } from '@app/_lib/constants'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { IMAGE_SIZE } from '@app/_lib/types'
/* Utils */
import { getCachedPage } from '@app/_lib/data/mongo/wordpress/page'
import { getThumbnailFromPost } from '@app/_lib/data/mysql/utils'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${BASE_URL}/about`,
    },
}

export default async function About() {
    const request = unstable_cache(
        async () => await getCachedPage('about'),
        ['about', VERSION],
        {
            tags: ['wordpress', 'page'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    const post = await request().catch(() => notFound())
    const thumbnail = getThumbnailFromPost(post, IMAGE_SIZE.MEDIUM_LARGE)

    return (
        <Wrapper
            className="page--about"
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
