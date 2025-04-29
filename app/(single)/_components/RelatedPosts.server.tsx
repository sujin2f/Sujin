import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { CardsServer } from '@app/archive/_components/Cards.server'
import { Loading } from '@app/archive/_components/Loading'
/* Utils */
import { getCachedRelatedPosts } from '@app/(single)/_lib/getCachedRelatedPosts'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'

interface Props {
    slug: string
}

export const RelatedPosts = async ({ slug }: Props) => {
    const request = unstable_cache(
        async (slug) => await getCachedRelatedPosts(slug),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post', 'related-posts'],
            revalidate,
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
