import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import { Tags } from '@lib/components/single/Tags'
import { PrevNextPost } from '@lib/components/single/PrevNext.post'
import { RelatedPosts } from '@lib/components/single/RelatedPosts'
import { RecentPosts } from '@lib/components/single/RecentPosts'
import { SocialShare } from '@lib/components/single/SocialShare.client'
import Column from '@common/components/layout/Column'
import { Content } from '@lib/components/single/Content'
import { GoogleAdvert } from '@common/components/GoogleAdvert'
/* CONSTANTS */
import { MENU_NAMES, IMAGE_SIZE, COLLECTION, POST_STATUS } from '@sujin/lib/constants'
import { post as getPost } from '@lib/apollo/queries/wordpress/posts/post'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { gqlRequest, publish } from '@lib/redis/client'
import { prevNext } from '@lib/apollo/queries/wordpress/posts/prevNext'
import { related } from '@lib/apollo/queries/wordpress/posts/related'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'
import { recent } from '@lib/apollo/queries/wordpress/posts/recent'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params
    const slug = params.slug.toLowerCase()

    const post = await gqlRequest<T_Post>(async () => await getPost(slug), `${COLLECTION.POST}-${slug}`).catch(
        () => undefined,
    )

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

    const post = await gqlRequest<T_Post>(async () => await getPost(slug), `${COLLECTION.POST}-${slug}`)
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
    const thumbnail = getThumbnailFromPost(post.images, [IMAGE_SIZE.MEDIUM_LARGE])
    const tags = post.archives.filter((tag) => tag.type === 'tag')

    const slugs: string[] = []
    if (tags.length && post.status === POST_STATUS.PUBLISH) {
        tags.forEach((tag) => slugs.push(tag.slug))
    }
    if (slug.length) {
        publish('update-hits', slugs)
    }

    async function requestPrevNext() {
        'use server'
        return await gqlRequest(async () => await prevNext(slug), `${COLLECTION.POST}-${slug}-prevNext`).catch(() => [])
    }
    async function requestRelated() {
        'use server'
        return await gqlRequest(async () => await related(slug), `${COLLECTION.POST}-${slug}-related`).catch(() => [])
    }
    async function requestRecent() {
        'use server'
        return await gqlRequest(async () => await recent(), `${COLLECTION.POST}-recent`).catch(() => [])
    }

    return (
        <>
            <Banner
                menu={MENU_NAMES.MAIN}
                excerpt={post.excerpt}
                title={post.title}
                icon={post.images?.icon}
                background={post.images?.background}
            />
            <Row>
                <Column medium={12} large={7} largeOffset={2}>
                    <Content post={post} type="post">
                        <Tags items={tags} />
                        <SocialShare
                            title={post.title}
                            excerpt={post.excerpt}
                            thumbnail={thumbnail}
                            baseUrl={`${process.env.NEXT_BASE_URL}`}
                        />
                        <PrevNextPost action={requestPrevNext} />
                        <RelatedPosts action={requestRelated} />
                    </Content>
                </Column>

                <Column small={12} large={3} className="layout__article__right" dom="aside">
                    <RecentPosts id={post.id} action={requestRecent} />
                    <GoogleAdvert
                        responsive
                        place="sidebar"
                        clientId={`${process.env.GOOGLE_AD_CLIENT}`}
                        slot={`${process.env.GOOGLE_AD_SLOT_SIDEBAR}`}
                    />
                </Column>
            </Row>
        </>
    )
}
