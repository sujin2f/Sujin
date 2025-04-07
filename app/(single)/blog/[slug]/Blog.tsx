import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import ScrollToTop from '@common/components/ScrollToTop'
import { Tags } from '@app/(single)/_components/Tags'
import { PrevNextWithPost } from '@app/(single)/_components/PrevNext'
import { RelatedPosts } from '@app/(single)/_components/RelatedPosts'
import { RecentPosts } from '@app/(single)/_components/RecentPosts'
import { SocialShare } from '@app/(single)/_components/SocialShare'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Content } from '@app/(single)/_components/Content'
import { GoogleAdvert } from '@app/_components/GoogleAdvert'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { IMAGE_SIZE } from '@app/_lib/data/types'
/* Utils */
import { getCachedPost } from '@app/_lib/data/mongo/wordpress/post'
import { updateHits } from '@app/_lib/data/mongo/wordpress/tag'
import { getThumbnailFromPost } from '@app/_lib/data/mysql/utils'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export default async function Blog(props: Props) {
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
    const thumbnail = getThumbnailFromPost(post, IMAGE_SIZE.MEDIUM_LARGE)
    const tags = post.terms.filter((term) => term.type === 'tag')

    // Update Tag Cloud
    if (tags.length) {
        tags.forEach((tag) => updateHits(tag.slug))
    }

    return (
        <main>
            <Banner
                banner={{
                    title: post.title,
                    excerpt: post.excerpt,
                    icon: post.images.icon,
                    background: post.images.background,
                    backgroundColor: post.meta.backgroundColor,
                }}
            />
            <Row>
                <ScrollToTop />
                <Column medium={12} large={7} largeOffset={2}>
                    <Content post={post} type="post">
                        <Tags items={tags} />
                        <SocialShare
                            title={post.title}
                            excerpt={post.excerpt}
                            thumbnail={thumbnail}
                        />
                        <PrevNextWithPost post={post} />
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
        </main>
    )
}
