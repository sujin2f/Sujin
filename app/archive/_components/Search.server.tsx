import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import sanitize from 'mongo-sanitize'
/* Components */
import { Cards } from '@app/archive/_components/Cards.use'
import Wrapper from '@app/_components/Wrapper'
import { Loading } from '@app/archive/_components/Loading'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/constants'
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
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
/* T_Types */
import type { T_Mongo } from '@common/types/mongo'

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
            <Suspense fallback={<Loading />}>
                <Cards
                    keyPrefix={`${ARCHIVE.SEARCH}-${slug}-${page}`}
                    posts={request(slug, page).catch((e) => {
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

const request = async (
    text: string,
    page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = unstable_cache(
        cached,
        [ARCHIVE.SEARCH, text, page.toString(), VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate,
        },
    )
    return await request(text, page)
}

const cached = async (
    text: string,
    page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, 'search', text, page),
    )
    return await request(text, page)
}

const query = async (_text: string, _page: number) => {
    const text = sanitize(_text)
    const page = sanitize(_page)
    const doc = {
        $text: { $search: text },
        status: POST_STATUS.PUBLISH,
    }

    const collection = await getCollection<T_Mongo<T_Post>>(COLLECTION.POST)
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
            ...getAggregation('expand-archive'),
            ...getAggregation('to-archive-post'),
        ])
        .toArray()

    if (!list.length) {
        new NoContentError(`Search result ${text} is empty`).log()
        notFound()
    }

    return {
        list,
        pages: Math.ceil(total / PER_PAGE),
    }
}
