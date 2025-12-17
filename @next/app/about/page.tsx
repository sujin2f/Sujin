import { connection } from 'next/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Model */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { SocialShare } from '@app/blog/_components/SocialShare'
import { Content } from '@app/blog/_components/Content'
import { Main } from '@app/_components/html-elements/Main'
/* Utils */
import { getPage } from '@app/about/_lib/getPage'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${process.env.NEXT_BASE_URL}/about`,
    },
}

export default async function AboutPage() {
    await connection()

    const post = await getPage('about')
        .then((result) => {
            if (!result || !result.slug) {
                throw new Error(`🤬 Page about request has been failed: No-content.`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            notFound()
        })
    const thumbnail = post.images && (post.images.list?.url || post.images.thumbnail?.url)

    return (
        <Main className="max-w-4xl">
            <Content post={post}>
                <SocialShare
                    title={post.title}
                    excerpt={post.excerpt}
                    thumbnail={thumbnail || '/assets/thumbnail.png'}
                    baseUrl={`${process.env.NEXT_BASE_URL}`}
                />
            </Content>
        </Main>
    )
}
