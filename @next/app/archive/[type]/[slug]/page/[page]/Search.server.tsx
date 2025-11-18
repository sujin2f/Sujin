import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards.use'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import SEARCH_QUERY from '@lib/apollo/queries/wordpress/posts/search.graphql'
/* Utils */
import { cachedGQLRequest } from '@lib/apollo/queries/GQLRequest'
/* T_Types */
import type { WithNumPages, T_ArchivePost } from '@sujin/lib/types'

type Props = {
    slug: string
    page: number
}

export async function SearchServer({ slug, page }: Props) {
    const posts = cachedGQLRequest<{
        search: WithNumPages<T_ArchivePost, 'items'>
    }>(
        SEARCH_QUERY,
        { keyword: slug, page },
        [COLLECTION.ARCHIVE, 'posts', 'search', slug, page.toString()], // TODO
    )
        .then((result) => {
            if (!result.data) {
                return {
                    items: [] as T_ArchivePost[],
                    numPages: 1,
                }
            }
            return result.data.search
        })
        .catch(() => notFound())

    return (
        <Wrapper
            title={`Search Result: ${decodeURIComponent(slug)}`}
            prefix={'Search'}
        >
            <Suspense fallback={<LoadingArchive />}>
                <Cards
                    keyPrefix={`${ARCHIVE.SEARCH}-${slug}-${page}`}
                    posts={posts}
                    listKey="items"
                    page={page}
                    pageURLPrefix={`/${ARCHIVE.SEARCH}/${slug}/page`}
                    large={4}
                    medium={6}
                    small={12}
                />
            </Suspense>
        </Wrapper>
    )
}
