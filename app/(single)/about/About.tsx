import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { SocialShare } from '@app/(single)/_components/SocialShare'
import { Content } from '@app/(single)/_components/Content'
import { ScrollToTop } from '@app/_components/ScrollToTop'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Utils */
import { getCachedPage } from '@app/_lib/data/mongo/wordpress/page'
import { getThumbnailFromPost } from '@app/_lib/data/mysql/utils'

export async function About() {
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
        <main className="page--page">
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
    )
}
