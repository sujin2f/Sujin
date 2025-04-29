import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
/* Components */
import { CardsServer } from '@app/archive/_components/Cards.server'
import Wrapper from '@app/_components/Wrapper'
import { Loading } from '@app/archive/_components/Loading'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { ARCHIVE } from '@app/_lib/types'
import { revalidate } from '@app/_lib/constants'
/* Models */
import { A_Error, NoContentError } from '@common/model/Error'
/* Utils */
import { getCachedSearchPosts } from '@app/archive/_lib/getCachedSearchPosts'

type Props = {
    slug: string
    page: number
}

export async function SearchServer({ slug, page }: Props) {
    const request = unstable_cache(
        async (slug, page) =>
            await getCachedSearchPosts(slug, page).catch((e) => {
                if (e instanceof NoContentError) {
                    e.log()
                    notFound()
                }
                if (e instanceof A_Error) {
                    e.log()
                }
                throw e
            }),
        [ARCHIVE.SEARCH, slug, page.toString(), VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate,
        },
    )

    return (
        <Wrapper
            title={`Search Result: ${decodeURIComponent(slug)}`}
            prefix={'Search'}
        >
            <Suspense fallback={<Loading />}>
                <CardsServer
                    keyPrefix={`${ARCHIVE.SEARCH}-${slug}-${page}`}
                    posts={request(slug, page)}
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
