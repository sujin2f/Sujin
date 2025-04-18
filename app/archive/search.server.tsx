import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
/* Components */
import { CardsServer } from '@app/_components/archive/cards.server'
import Wrapper from '@app/_components/Wrapper'
import { Loading } from '@app/_components/archive/loading'
/* CONSTANTS */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { ARCHIVE, type ArchiveProp } from '@app/_lib/types'
/* Utils */
import { getCachedSearchPosts } from '@app/_lib/data/mongo/wordpress/post'

export async function SearchServer({ page, slug }: ArchiveProp) {
    const requestArchive = unstable_cache(
        async (slug, page) => await getCachedSearchPosts(slug, page),
        [ARCHIVE.SEARCH, slug, page.toString(), VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    return (
        <Wrapper title={`Search Result: ${slug}`} prefix={'Search'}>
            <Suspense fallback={<Loading />}>
                <CardsServer
                    keyPrefix={`${ARCHIVE.SEARCH}-${slug}-${page}`}
                    posts={requestArchive(slug, page)}
                    page={page}
                    pageURLPrefix={`/${ARCHIVE.SEARCH}/${slug}`}
                    large={4}
                    medium={6}
                    small={12}
                />
            </Suspense>
        </Wrapper>
    )
}
