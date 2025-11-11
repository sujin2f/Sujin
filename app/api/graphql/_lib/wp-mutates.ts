'use server'
import sanitize from 'mongo-sanitize'
/* Models */
import Cached from '@sujin/common/model/Cached'
/* T_Types */
import type { MutationResultType } from '@app/api/graphql/_lib/constants'
/* Utils */
import { auth } from '@app/api/auth/_lib/utils-mysql'
import { updateArchive } from '@app/admin/_lib/updateArchive'
import { updatePage } from '@app/_lib/utils/mongo/updatePage'
import { updateBackgrounds } from '@app/_lib/utils/mongo/updateBackgrounds'
import { getPostBy } from '@app/_lib/utils/mysql/getPostBy'
import { getCacheKey } from '@app/_lib/utils/cache'
import { updateTotal } from '@app/_lib/utils/mongo/updateTotal'
import { updateFromMySQL } from '@app/_lib/utils/mongo/updateFromMySQL'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, POST_TYPE } from '@app/_lib/types'

/**
 * Updates an archive from MySQL and clears associated cache.
 *
 * @param {string} slug - The ID of the term.
 * @param {ARCHIVE} type
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 */
const mutateArchive = async (
    slug: string,
    type: ARCHIVE,
): Promise<MutationResultType> => {
    await updateArchive(slug, type)
    return {
        result: true,
    }
}

export const mutateTag = async (
    nonce: string,
    _slug: string,
): Promise<MutationResultType> => {
    const slug = sanitize(_slug)
    await auth(nonce, slug)
    return await mutateArchive(slug, ARCHIVE.TAG)
}

export const mutateCategory = async (
    nonce: string,
    _slug: string,
): Promise<MutationResultType> => {
    const slug = sanitize(_slug)
    await auth(nonce, slug)
    return await mutateArchive(slug, ARCHIVE.CATEGORY)
}

export const mutatePost = async (
    nonce: string,
    _slug: string,
): Promise<MutationResultType> => {
    const slug = sanitize(_slug)
    await auth(nonce, slug)

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        const archives = await updateFromMySQL(post)
        await updateTotal(archives)
    })

    return {
        result: true,
    }
}

/**
 * Update Mongo Post type from MySQL for GraphQL
 *
 * @param {string} nonce - WP nonce
 * @param {string} _slug - Post slug
 * @returns {Promise<MutationResultType>}
 */
export const mutatePage = async (
    nonce: string,
    _slug: string,
): Promise<MutationResultType> => {
    const slug = sanitize(_slug)
    await auth(nonce, slug)
    await updatePage(slug)
    return {
        result: true,
    }
}

/**
 * Update Mongo Post type from MySQL for GraphQL
 *
 * @param {string} nonce - WP nonce
 * @returns {Promise<MutationResultType>}
 */
export const mutateBackground = async (
    nonce: string,
): Promise<MutationResultType> => {
    await auth(nonce, POST_TYPE.ATTACHMENT)
    await updateBackgrounds()
    return {
        result: true,
    }
}
