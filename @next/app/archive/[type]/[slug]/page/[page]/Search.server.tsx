import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards.use'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import POST_LIST_QUERY from '@lib/apollo/gql/post.list.graphql'
/* Utils */
import { cachedGQLRequest } from '@lib/apollo/GQLRequest'
/* T_Types */
import type { PropWithPages, T_Post } from '@sujin/lib/types'

type Props = {
    slug: string
    page: number
}

export async function SearchServer({ slug, page }: Props) {
    const posts = cachedGQLRequest<PropWithPages<T_Post, 'post'>>(
        POST_LIST_QUERY,
        { page, category: `search-${slug}` },
        [COLLECTION.ARCHIVE, 'posts', 'search', slug, page.toString()],
    )
        .then((result) => {
            if (!result.data) {
                notFound()
            }
            return result.data
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
                    listKey="post"
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
