import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Model */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { SocialShare } from '@lib/components/single/SocialShare.client'
import { Content } from '@lib/components/single/Content'
/* CONSTANTS */
import { COLLECTION, IMAGE_SIZE, MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { page as getPage } from '@lib/apollo/queries/wordpress/pages/page'
import { getThumbnailFromPost } from '@lib/utils/client'
import { gqlRequest } from '@lib/redis/client'
/* Assets */
import '@lib/components/single/AboutItem.scss'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${process.env.NEXT_BASE_URL}/about`,
    },
}

export default async function AboutPage() {
    const post = await gqlRequest(async () => await getPage('about'), `${COLLECTION.PAGE}-about`)
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
        <>
            <Banner
                menu={MENU_NAMES.MAIN}
                excerpt={post.excerpt}
                title={post.title}
                icon={post.images?.icon}
                background={post.images?.background}
            />
            <Row fullWidth>
                <Column medium={12} large={6} largeOffset={3}>
                    <Content post={post} type="page">
                        <SocialShare
                            title={post.title}
                            excerpt={post.excerpt}
                            thumbnail={thumbnail}
                            baseUrl={`${process.env.NEXT_BASE_URL}`}
                        />
                    </Content>
                </Column>
            </Row>
        </>
    )
}
