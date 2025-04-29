'use server'
import sanitize from 'mongo-sanitize'
/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { COLLECTION } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { deleteOne } from '@common/data/mongo/mongo'

/**
 * Admin remove page
 *
 * @param {string} _slug - slug
 * @returns {Promise<void>}
 */
export const removePage = async (_slug: string): Promise<void> => {
    const slug = sanitize(_slug)
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    await deleteOne(COLLECTION.PAGE, { slug })
}
