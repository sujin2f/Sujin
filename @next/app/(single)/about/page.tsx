import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { SocialShare } from '@lib/components/single/SocialShare.client'
import { Content } from '@lib/components/single/Content'
/* CONSTANTS */
import { BASE_URL } from '@lib/constants'
import { COLLECTION, IMAGE_SIZE, MENU_NAMES } from '@sujin/lib/constants'
import PAGE_QUERY from '@lib/apollo/queries/wordpress/pages/page.graphql'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { cachedGQLRequest } from '@lib/apollo/queries/GQLRequest'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${BASE_URL}/about`,
    },
}

export default async function AboutPage() {
    const post = await cachedGQLRequest<{ page: T_Post }>(PAGE_QUERY, { slug: 'about' }, [COLLECTION.PAGE, 'about'])
        .then((result) => {
            if (!result || !result.data) {
                notFound()
            }
            return result.data.page
        })
        .catch(() => notFound())

    const thumbnail = getThumbnailFromPost(post.images, IMAGE_SIZE.MEDIUM_LARGE)

    return (
        <>
            <Banner
                menu={MENU_NAMES.MAIN}
                excerpt={post.excerpt}
                title={post.title}
                icon={post.images?.icon}
                background={post.images?.background}
                backgroundColor={post.meta?.backgroundColor}
            />
            <Row fullWidth>
                <Column medium={12} large={6} largeOffset={3}>
                    <Content post={post} type="page">
                        <SocialShare title={post.title} excerpt={post.excerpt} thumbnail={thumbnail} />
                    </Content>
                </Column>
            </Row>
        </>
    )
}
