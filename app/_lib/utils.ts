import { headers } from 'next/headers'
import {
    MenuDefault,
    MenuDevTool,
    MenuEther,
    MenuEtherKor,
} from '@app/_lib/constants'
import { MenuNames } from '@app/_lib/data/mysql/constants'
import type { Nullable } from '@common/types'
import { ARCHIVE, type MenuItem } from '@app/_lib/data/mysql/types'
import { COLLECTION } from '@app/_lib/data/mongo/constants'
import { VERSION } from '@common/constants/helper'
import { Metadata, METADATA } from '@app/_lib/constants'

export const getMenuNameFromPath = (path: Nullable<string>) => {
    if (!path) {
        return MenuNames.MAIN
    }
    if (path.startsWith('/ether/for')) {
        return MenuNames.ETHER_KOR
    }
    if (path.startsWith('/ether')) {
        return MenuNames.ETHER
    }
    if (path.startsWith('/dev-tools')) {
        return MenuNames.DEV_TOOL
    }
    return MenuNames.MAIN
}

export const getMenu = (menu: MenuNames): MenuItem[] => {
    switch (menu) {
        case MenuNames.ETHER:
            return MenuEther
        case MenuNames.ETHER_KOR:
            return MenuEtherKor
        case MenuNames.DEV_TOOL:
            return MenuDevTool
        default:
            return MenuDefault
    }
}

/**
 *
 * @param {COLLECTION} collection
 * @param {string} slug
 * @returns {string}
 */
export const getCacheKey = (
    collection: COLLECTION | ARCHIVE,
    ...suffixes: (string | number)[]
): string => {
    const suffix = suffixes?.join('-')

    switch (collection) {
        case COLLECTION.POST:
            return `${VERSION}-post-${suffix}`
        case COLLECTION.PAGE:
            return `${VERSION}-page-${suffix}`
        case ARCHIVE.CATEGORY:
        case COLLECTION.CATEGORY:
            return `${VERSION}-category-${suffix}`
        case ARCHIVE.TAG:
        case COLLECTION.TAG:
            return `${VERSION}-tag-${suffix}`
        case COLLECTION.BACKGROUNDS:
            return `${VERSION}-backgrounds`
    }
    return ''
}

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
