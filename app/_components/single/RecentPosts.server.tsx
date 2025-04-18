import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { CardsServer } from '@app/_components/archive/cards.server'
import { Loading } from '@app/_components/archive/loading'
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
        async () =>
            await getCachedRecentPosts().then((recent) => ({
                ...recent,
                posts: recent.posts
                    .filter((item) => item.id !== current)
                    .slice(0, 4),
            })),
        [VERSION],
        {
            tags: ['wordpress', 'post', 'recent-posts'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    return (
        <section className="recent-posts show-for-large">
            <WidgetTitle>Recent Posts</WidgetTitle>
            <Suspense fallback={<Loading small={12} counts={4} />}>
                <CardsServer
                    posts={request()}
                    keyPrefix="recent"
                    imageSize={IMAGE_SIZE.RECENT_POST}
                />
            </Suspense>
        </section>
    )
}
