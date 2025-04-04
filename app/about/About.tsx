import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
/* Components */
import Banner from '@app/components/header/Banner'
import Header from '@app/components/header'
import Footer from '@app/components/footer'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { SocialShare } from '@app/components/single/SocialShare'
import { Content } from '@app/components/single/Content'
import ScrollToTop from '@app/components/common/ScrollToTop'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { MenuNames } from '@app/helpers/constants/mysql-query'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Utils */
import { getCachedPage } from '@app/helpers/data/mongo/wordpress/page'
import { getThumbnailFromPost } from '@app/helpers/utils/wordpress'

export default async function About() {
    const request = unstable_cache(
        async () => await getCachedPage('about'),
        ['about', VERSION],
        {
            tags: ['wordpress', 'page'],
            revalidate: IS_DEV ? false : HOUR_IN_SECONDS,
        },
    )

    const post = await request().catch(() => notFound())
    const thumbnail = getThumbnailFromPost(post)

    return (
        <>
            <Header />
            <main className="page--page">
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
                    <Column medium={12} large={8} largeOffset={2}>
                        <Content post={post} type="page">
                            <SocialShare
                                title={post.title}
                                excerpt={post.excerpt}
                                thumbnail={thumbnail}
                            />
                        </Content>
                    </Column>
                </Row>
            </main>
            <Footer />
        </>
    )
}
