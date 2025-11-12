import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import { Cards } from '@lib/components/archive/Cards.use'
import Wrapper from '@lib/components/Wrapper'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
/* Models */
import { A_Error, NoContentError } from '@sujin/share/model/Error'
import { getPosts } from '@lib/apollo/single'
import { ARCHIVE_POSTS } from '@lib/constants/graphql-fields'

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
                    ).catch((e) => {
                        if (e instanceof NoContentError) {
                            e.log()
                            notFound()
                        }
                        if (e instanceof A_Error) {
                            e.log()
                        }
                        throw e
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
