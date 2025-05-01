import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import sanitize from 'mongo-sanitize'
/* Components */
import { Cards } from '@app/archive/_components/Cards'
import Wrapper from '@app/_components/Wrapper'
import { Loading } from '@app/archive/_components/Loading'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { revalidate } from '@app/_lib/constants'
import {
    ARCHIVE,
    COLLECTION,
    POST_STATUS,
    type T_Post,
    type T_ArchivePost,
    type PropWithPages,
} from '@app/_lib/types'
/* Models */
import { A_Error, NoContentError } from '@common/model/Error'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { cachedRequest } from '@app/_lib/utils/cache'
/* T_Types */
import type { T_Mongo } from '@common/types/mongo'

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
                <Cards
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

export const getCachedSearchPosts = async (
    _text: string,
    _page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const text = sanitize(_text)
    const page = sanitize(_page)
    let error: Error | null = null

    const search = await cachedRequest(
        COLLECTION.ARCHIVE,
        ['search', text, page],
        async () => {
            const doc = {
                $text: { $search: text },
                status: POST_STATUS.PUBLISH,
            }

            const collection = await getCollection<T_Mongo<T_Post>>(
                COLLECTION.POST,
            )
            const total = await collection.countDocuments(doc)
            const list = await collection
                .aggregate<T_ArchivePost>([
                    {
                        $match: doc,
                    },
                    {
                        $sort: { date: -1 },
                    },
                    ...getAggregation('paging', page),
                    ...getAggregation('_id'),
                    ...getAggregation('expand-archive'),
                    ...getAggregation('to-archive-post'),
                ])
                .toArray()

            // Failed to find the post, cache false
            if (!list.length) {
                error = new NoContentError(`Search result ${text} is empty`)
                return false
            }

            return {
                list,
                pages: Math.ceil(total / PER_PAGE),
            } satisfies PropWithPages<T_ArchivePost>
        },
    )

    if (error) {
        throw error
    }

    return search as PropWithPages<T_ArchivePost>
}
