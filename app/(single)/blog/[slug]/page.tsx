import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { Tags } from '@app/(single)/_components/Tags'
import { PrevNextClient } from '@app/(single)/_components/PrevNextClient'
import { RelatedPosts } from '@app/(single)/_components/RelatedPosts'
import { RecentPosts } from '@app/(single)/_components/RecentPosts'
import { SocialShare } from '@app/(single)/_components/SocialShare'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Content } from '@app/(single)/_components/Content'
import { GoogleAdvert } from '@app/_components/GoogleAdvert'
/* CONSTANTS */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { BASE_URL } from '@app/_lib/constants'
import { VERSION, IS_DEV } from '@common/constants/helper'
import { IMAGE_SIZE, POST_STATUS } from '@app/_lib/types'
/* Utils */
import { getCachedPost } from '@app/_lib/data/mongo/wordpress/post'
import { getThumbnailFromPost } from '@app/_lib/data/mysql/utils'
import { updateHits } from '@app/_lib/data/mongo/wordpress/tag'
import { isAdmin } from '@app/_lib/utils-server'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const { slug } = await props.params
    const requestPost = unstable_cache(
        async (slug) => await getCachedPost(slug),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post'],
            revalidate: IS_DEV ? false : HOUR_IN_SECONDS,
        },
    )
    const post = await requestPost(slug.toLowerCase()).catch(() => null)
    if (!post) {
        return {}
    }

    const url = `${BASE_URL}/blog/${slug}`
    const images = getThumbnailFromPost(post, IMAGE_SIZE.MEDIUM_LARGE)
    const keywords = post.terms.map((term) => term.title)

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

export default async function Page(props: Props) {
    const { slug } = await props.params
    const requestPost = unstable_cache(
        async (slug) => await getCachedPost(slug),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post'],
            revalidate: IS_DEV ? false : HOUR_IN_SECONDS,
        },
    )
    const post = await requestPost(slug.toLowerCase()).catch(() => notFound())
    if (!(await isAdmin()) && post.status !== POST_STATUS.PUBLISH) {
        notFound()
    }
    const thumbnail = getThumbnailFromPost(post, IMAGE_SIZE.MEDIUM_LARGE)
    const tags = post.terms.filter((term) => term.type === 'tag')

    // Update Tag Cloud
    if (tags.length && post.status === POST_STATUS.PUBLISH) {
        tags.forEach((tag) => updateHits(tag.slug))
    }

    return (
        <Wrapper
            className={`post--${slug}`}
            title={post.title}
            excerpt={post.excerpt}
            icon={post.images?.icon}
            background={post.images?.background}
            backgroundColor={post.meta?.backgroundColor}
        >
            <Row fullWidth>
                <Column medium={12} large={7} largeOffset={2}>
                    <Content post={post} type="post">
                        <Tags items={tags} />
                        <SocialShare
                            title={post.title}
                            excerpt={post.excerpt}
                            thumbnail={thumbnail}
                        />
                        <PrevNextClient slug={post.slug} />
                        <RelatedPosts post={post} />
                    </Content>
                </Column>

                <Column
                    small={12}
                    large={3}
                    className="layout__article__right"
                    dom="aside"
                >
                    <RecentPosts current={post.id} />
                    <GoogleAdvert responsive place="sidebar" />
                </Column>
            </Row>
        </Wrapper>
    )
}
