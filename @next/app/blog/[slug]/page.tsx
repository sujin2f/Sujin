import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { Tags } from '@app/blog/_components/Tags'
import { RelatedPosts } from '@app/blog/_components/RelatedPosts'
import { RecentPosts } from '@app/blog/_components/RecentPosts'
import { SocialShare } from '@app/blog/_components/SocialShare'
import { Content } from '@app/blog/_components/Content'
import { GoogleAdvert } from '@common/components/GoogleAdvert'
import { Main } from '@app/_components/html-elements/Main'
/* CONSTANTS */
import { IMAGE_SIZE, POST_STATUS } from '@sujin/lib/constants'
/* Utils */
import { getPost } from '@app/blog/_lib/getPost'
import { getThumbnailFromPost } from '@lib/utils/client'
import { publish } from '@app/_lib/utils/redis'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export const dynamic = 'force-dynamic'

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params
    const slug = params.slug.toLowerCase()

    const post = await getPost(slug).catch(() => undefined)

    if (!post) {
        return {}
    }

    const url = `${process.env.NEXT_BASE_URL}/blog/${slug}`
    const images = getThumbnailFromPost(post.images, [IMAGE_SIZE.MEDIUM_LARGE])
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

    const post = await getPost(slug)
        .then((result) => {
            if (!result.slug) {
                throw new Error(`🤬 Post ${slug} request has been failed: No-content.`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            notFound()
        })
    const url = post.images && (post.images.list?.url || post.images.thumbnail?.url)
    const tags = post.archives.filter((tag) => tag.type === 'tag')

    const slugs: string[] = []
    if (tags.length && post.status === POST_STATUS.PUBLISH) {
        tags.forEach((tag) => slugs.push(tag.slug))
    }
    if (slug.length) {
        publish('update-hits', slugs)
    }

    return (
        <Main className="grid w-full max-w-2xl grid-cols-1 gap-8 xl:max-w-6xl xl:grid-cols-[minmax(0,1fr)_var(--container-3xs)]">
            <div>
                <Content post={post}>
                    <Tags items={tags} />
                    <SocialShare
                        title={post.title}
                        excerpt={post.excerpt}
                        thumbnail={url || '/assets/thumbnail.png'}
                        baseUrl={`${process.env.NEXT_BASE_URL}`}
                    />
                    <RelatedPosts slug={post.slug} />
                </Content>
            </div>

            <aside>
                <RecentPosts id={post.id} />
                <GoogleAdvert
                    responsive
                    place="sidebar"
                    clientId={`${process.env.GOOGLE_AD_CLIENT}`}
                    slot={`${process.env.GOOGLE_AD_SLOT_SIDEBAR}`}
                />
            </aside>
        </Main>
    )
}
