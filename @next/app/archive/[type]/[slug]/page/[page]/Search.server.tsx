import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards.use'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
import { ARCHIVE_POSTS } from '@lib/constants/graphql-fields'
/* Utils */
import { getPosts } from '@lib/apollo/single'

type Props = {
    slug: string
    page: number
}

export async function SearchServer({ slug, page }: Props) {
    return (
        <Wrapper
            title={`Search Result: ${decodeURIComponent(slug)}`}
            prefix={'Search'}
        >
            <Suspense fallback={<LoadingArchive />}>
                <Cards
                    keyPrefix={`${ARCHIVE.SEARCH}-${slug}-${page}`}
                    posts={getPosts(
                        `search-${slug}`,
                        page,
                        ARCHIVE_POSTS,
                    ).catch(() => {
                        notFound()
                    })}
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
