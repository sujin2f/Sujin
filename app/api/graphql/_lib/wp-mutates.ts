'use server'
import sanitize from 'mongo-sanitize'
/* T_Types */
import type { MutationResultType } from '@app/api/graphql/_lib/constants'
/* Utils */
import { auth } from '@app/_lib/data/mongo/user'
import { updateArchive } from '@app/admin/_lib/updateArchive'
import { updatePost } from '@app/admin/_lib/update-post'
import { updatePage } from '@app/admin/_lib/updatePage'
import { updateBackgrounds } from '@app/admin/_lib/updateBackgrounds'
/* CONSTANTS */
import { ARCHIVE, POST_TYPE } from '@app/_lib/types'

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
    await updatePost(slug)
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
