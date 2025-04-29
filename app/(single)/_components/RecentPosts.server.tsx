import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { CardsServer } from '@app/archive/_components/Cards.server'
import { Loading } from '@app/archive/_components/Loading'
/* Utils */
import { getCachedRecentPosts } from '@app/(single)/_lib/getCachedRecentPosts'
/* CONSTANTS */
import { IMAGE_SIZE } from '@app/_lib/types'
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'

export const RecentPosts = async ({ current }: { current: number }) => {
    const request = unstable_cache(
        async () =>
            await getCachedRecentPosts().then((recent) => ({
                ...recent,
                list: recent.list
                    .filter((item) => item.id !== current)
                    .slice(0, 4),
            })),
        [VERSION],
        {
            tags: ['wordpress', 'post', 'recent-posts'],
            revalidate,
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
