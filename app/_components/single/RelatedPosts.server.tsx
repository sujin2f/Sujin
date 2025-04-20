import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { CardsServer } from '@app/_components/archive/cards.server'
import { Loading } from '@app/_components/archive/loading'
/* Utils */
import { getCachedRelatedPosts } from '@app/_lib/data/mongo/wordpress/post'
/* CONSTANTS */
import { IS_DEV, VERSION } from '@common/constants/helper'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'

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

    return (
        <section className="related-posts">
            <WidgetTitle>Related Posts</WidgetTitle>

            <Suspense fallback={<Loading medium={6} small={12} counts={4} />}>
                <CardsServer
                    posts={request(slug)}
                    keyPrefix="related"
                    medium={6}
                    small={12}
                />
            </Suspense>
        </section>
    )
}
