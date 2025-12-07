import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Model */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { SocialShare } from '@app/_components/single/SocialShare.client'
import { Content } from '@app/_components/single/Content'
/* CONSTANTS */
import { IMAGE_SIZE } from '@sujin/lib/constants'
/* Utils */
import { getPage } from '@app/_lib/graphql/getPage'
import { getThumbnailFromPost } from '@lib/utils/client'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${process.env.NEXT_BASE_URL}/about`,
    },
}

export default async function AboutPage() {
    const post = await getPage('about')
        .then((result) => {
            if (!result.slug) {
                throw new Error(`🤬 Page about request has been failed: No-content.`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            notFound()
        })
    const thumbnail = getThumbnailFromPost(post.images, [IMAGE_SIZE.MEDIUM_LARGE])

    return (
        <main className="container mx-auto max-w-4xl mt-15">
            <Content post={post}>
                <SocialShare
                    title={post.title}
                    excerpt={post.excerpt}
                    thumbnail={thumbnail}
                    baseUrl={`${process.env.NEXT_BASE_URL}`}
                />
            </Content>
        </main>
    )
}
