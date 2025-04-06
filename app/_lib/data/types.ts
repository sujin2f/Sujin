/**
 * Common type definition across databases
 */

export const ARCHIVE = {
    CATEGORY: 'category',
    TAG: 'tag',
} as const
export type ARCHIVE = (typeof ARCHIVE)[keyof typeof ARCHIVE]

export const POST_TYPE = {
    POST: 'post',
    PAGE: 'page',
    ATTACHMENT: 'attachment',
} as const
export type POST_TYPE = (typeof POST_TYPE)[keyof typeof POST_TYPE]

export const COLLECTION = {
    ...ARCHIVE,
    POST: POST_TYPE.POST,
    PAGE: POST_TYPE.PAGE,
    BACKGROUNDS: 'background',
    OPTIONS: 'option',
    SPECTRA: 'spectra',
    USERS: 'user',
} as const
export type COLLECTION = (typeof COLLECTION)[keyof typeof COLLECTION]

export const TAXONOMY = {
    ...ARCHIVE,
    POST_TAG: 'post_tag',
} as const
export type TAXONOMY = (typeof TAXONOMY)[keyof typeof TAXONOMY]

export const ARCHIVE_URL = {
    ...ARCHIVE,
    SEARCH: 'search',
} as const
export type ARCHIVE_URL = (typeof ARCHIVE_URL)[keyof typeof ARCHIVE_URL]
