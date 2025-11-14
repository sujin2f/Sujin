import { Suspense } from 'react'
import sanitize from 'mongo-sanitize'
/* Components */
import { PagesClient } from '@app/admin/_components/Pages.client'
import { LoadingTable } from '@app/_components/LoadingTable'
/* Models */
import Cached from '@sujin/common/model/Cached'
/* CONSTANTS */
import { COLLECTION, type T_Page } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { deleteOne } from '@sujin/common/data/mongo/mongo'
import { updatePage } from '@app/_lib/utils/mongo/updatePage'
import { getCollection } from '@sujin/common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'

type Props = {
    page: number
}

export async function PagesServer({ page }: Props) {
    const remove = async (slug: string): Promise<string> => {
        'use server'
        return await removePage(slug)
            .then(() => `Page ${slug} Removed`)
            .catch((e) => e.message)
    }

    const update = async (slug: string): Promise<string> => {
        'use server'
        return await updatePage(slug)
            .then(() => 'Update finished')
            .catch((e) => e.message)
    }

    return (
        <Suspense fallback={<LoadingTable />}>
            <PagesClient
                update={update}
                remove={remove}
                pages={getPages(page)}
                page={page}
            />
        </Suspense>
    )
}

/**
 * Admin remove page
 *
 * @param {string} _slug - slug
 * @returns {Promise<void>}
 */
const removePage = async (_slug: string): Promise<void> => {
    const slug = sanitize(_slug)
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    await deleteOne(COLLECTION.PAGE, { slug })
}

/**
 * Admin get Pages by pagination
 *
 * @param {number} page - Page
 * @returns {Promise<T_Page[]>}
 */
export const getPages = async (page: number = 1): Promise<T_Page[]> => {
    const collection = await getCollection<T_Page>(COLLECTION.PAGE)
    return await collection
        .aggregate<T_Page>([
            {
                $sort: { date: -1 },
            },
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
        ])
        .toArray()
}
