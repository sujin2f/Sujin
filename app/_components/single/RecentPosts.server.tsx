import { unstable_cache } from 'next/cache'
/* Components */
import { Row } from '@common/components/layout/Row'
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { Cards } from '@app/_components/archive/cards'
/* Utils */
import { getCachedRecentPosts } from '@app/_lib/data/mongo/wordpress/post'
/* CONSTANTS */
import { IMAGE_SIZE } from '@app/_lib/types'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
/* Assets */
import './style.scss'

export const RecentPosts = async ({ current }: { current: number }) => {
    const request = unstable_cache(
        async () => await getCachedRecentPosts(),
        [VERSION],
        {
            tags: ['wordpress', 'post', 'recent-posts'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )
    const posts = await request()

    return (
        <section className="recent-posts show-for-large">
            <WidgetTitle>Recent Posts</WidgetTitle>
            <Row fullWidth>
                <Cards
                    posts={posts
                        .filter((item) => item.id !== current)
                        .slice(0, 4)}
                    keyPrefix="recent"
                    imageSize={IMAGE_SIZE.RECENT_POST}
                />
            </Row>
        </section>
    )
}
