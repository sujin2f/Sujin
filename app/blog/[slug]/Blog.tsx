import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
/* Components */
import Banner from '@app/components/header/Banner'
import Header from '@app/components/header'
import Footer from '@app/components/footer'
import ScrollToTop from '@components/ScrollToTop'
import { Tags } from '@app/components/single/Tags'
import { PrevNextWithPost } from '@app/components/single/PrevNext'
import { RelatedPosts } from '@app/components/single/RelatedPosts'
import { RecentPosts } from '@app/components/single/RecentPosts'
import { SocialShare } from '@app/components/single/SocialShare'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Content } from '@app/components/single/Content'
import GoogleAdvert from '@components/GoogleAdvert'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { MenuNames } from '@src/constants/mysql-query'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Utils */
import { getCachedPost } from '@src/db/mongo/wordpress/post'
import { updateHits } from '@src/db/mongo/wordpress/tag'
import { getThumbnailFromPost } from '@src/utils/wordpress'

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
    const thumbnail = getThumbnailFromPost(post)
    const tags = post.terms.filter((term) => term.type === 'tag')

    // Update Tag Cloud
    if (tags.length) {
        tags.forEach((tag) => updateHits(tag.slug))
    }

    return (
        <>
            <Header />
            <main>
                <Banner
                    menu={MenuNames.MAIN}
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
            <Footer />
        </>
    )
}
