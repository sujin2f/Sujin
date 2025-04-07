import { headers } from 'next/headers'
import type { Nullable } from '@common/types'
import { Metadata, METADATA } from '@app/_lib/constants'

/**
 * Retrieves the current pathname from the headers.
 *
 * This function fetches the value of the `x-pathname` header and returns it.
 * If the header is not found, it returns `undefined`.
 *
 * @async
 * @returns {Promise<Nullable<string>>} The pathname as a string if found, otherwise `undefined`.
 * @todo Remove this and x-pathname for good
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
 * @todo Remove this and x-pathname for good
 */
export const getMetaData = async (): Promise<Metadata> => {
    const path = await getPathName()
    if (!path || !METADATA[path]) {
        throw Error('Cannot get metadata.')
    }
    return METADATA[path]
}
