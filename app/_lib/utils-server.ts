import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import type { Nullable } from '@common/types'
import { Metadata, METADATA } from '@app/_lib/constants'
import { authOptions } from '@app/api/auth/constants'
import type { ARCHIVE, POST_TYPE } from '@app/_lib/types'
import { getOption, removeOption } from '@app/_lib/data/mysql/option'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'

/**
 * Retrieves the current pathname from the headers.
 *
 * This function fetches the value of the `x-pathname` header and returns it.
 * If the header is not found, it returns `undefined`.
 *
 * @async
 * @returns {Promise<Nullable<string>>} The pathname as a string if found, otherwise `undefined`.
 */
export const getPathName = async (): Promise<Nullable<string>> =>
    (await headers()).get('x-pathname') || undefined

/**
 * Retrieves metadata based on the current pathname.
 *
 * This function fetches the current pathname from the headers and looks up
 * the corresponding metadata from the `METADATA` object. If the pathname
 * is not available or the metadata is not found for the given path, an error
 * is thrown.
 *
 * @async
 * @returns {Promise<Metadata>} The metadata corresponding to the current pathname.
 * @throws {Error} If the pathname is not found or metadata for the path is missing.
 */
export const getMetaData = async (): Promise<Metadata> => {
    const path = await getPathName()
    if (!path || !METADATA[path]) {
        throw Error('Cannot get metadata.')
    }
    return METADATA[path]
}

export const isAdmin = async (): Promise<boolean> => {
    const session = await getServerSession(authOptions)
    const email =
        session && session.user && session.user.email && session?.user?.email
    return email === process.env.ADMIN_EMAIL
}

/**
 * User admin and WP nonce allow to access
 *
 * @param {string} nonce
 * @param {string} slug
 * @param {ARCHIVE | POST_TYPE} type
 * @returns {Promise<void>}
 * @throws {ServerError} Failed to access
 */
export const auth = async (
    type?: ARCHIVE | POST_TYPE,
    nonce?: string,
    slug?: string,
): Promise<void> => {
    const admin = await isAdmin()
    if (admin) return

    // Nonce validation
    if (!type || !nonce) {
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
            `${type}::auth()`,
        )
    }
    const optionKey = ['mutate', type, slug, nonce].join('_')
    await getOption(optionKey).catch(() => {
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
            `${type}::auth()`,
        )
    })
    await removeOption(optionKey)
}
