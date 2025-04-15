import { unstable_cache } from 'next/cache'
/* Components */
import { Row } from '@common/components/layout/Row'
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { Cards } from '@app/_components/archive/cards'
/* Utils */
import { getCachedRelatedPosts } from '@app/_lib/data/mongo/wordpress/post'
/* CONSTANTS */
import { IS_DEV, VERSION } from '@common/constants/helper'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
/* Assets */
import './style.scss'

interface Props {
    slug: string
}

export const RelatedPosts = async ({ slug }: Props) => {
    const request = unstable_cache(
        async (slug) => await getCachedRelatedPosts(slug),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post', 'related-posts'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )
    const posts = await request(slug)

    return (
        <section className="related-posts">
            <WidgetTitle>Related Posts</WidgetTitle>

            <Row fullWidth>
                <Cards
                    posts={posts}
                    keyPrefix="related"
                    medium={6}
                    small={12}
                />
            </Row>
        </section>
    )
}
