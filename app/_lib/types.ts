/**
 * Common type definition
 */

import { ConstToType } from '@common/types'

export {
    IMAGE_SIZE_BACKGROUND,
    IMAGE_SIZE,
    POST_IMAGE_LOCATION,
} from '@app/_lib/types-image'
export type {
    T_Image,
    T_ImageSize,
    T_ImageBlock,
    T_PostImages,
    T_Background,
} from '@app/_lib/types-image'
export type {
    T_Term,
    T_Archive,
    T_Category,
    T_Tag,
} from '@app/_lib/types-archive'
export type {
    T_PrevNext,
    T_Post,
    T_MySQLPost,
    T_Page,
} from '@app/_lib/types-post'

/**
 * Archive types
 * @enum
 */
export const ARCHIVE = {
    CATEGORY: 'category',
    TAG: 'tag',
} as const
export type ARCHIVE = ConstToType<typeof ARCHIVE>

/**
 * WP Taxonomies
 * @enum
 */
export const TAXONOMY = {
    ...ARCHIVE,
    POST_TAG: 'post_tag',
} as const
export type TAXONOMY = ConstToType<typeof TAXONOMY>

/**
 * URL path for archives
 * @enum
 */
export const ARCHIVE_URL = {
    ...ARCHIVE,
    SEARCH: 'search',
} as const
export type ARCHIVE_URL = ConstToType<typeof ARCHIVE_URL>

/**
 * WP Post types
 * @enum
 */
export const POST_TYPE = {
    POST: 'post',
    PAGE: 'page',
    ATTACHMENT: 'attachment',
} as const
export type POST_TYPE = ConstToType<typeof POST_TYPE>

/**
 * @enum
 * @todo use this
 */
export const POST_STATUS = {
    PUBLISH: 'publish',
    DRAFT: 'draft',
    TRASH: 'trash',
} as const
export type POST_STATUS = ConstToType<typeof POST_STATUS>

/**
 * MongoDB collections
 * @enum
 */
export const COLLECTION = {
    ...ARCHIVE,
    POST: POST_TYPE.POST,
    PAGE: POST_TYPE.PAGE,
    BACKGROUNDS: 'background',
    OPTIONS: 'option',
    SPECTRA: 'spectra',
    USERS: 'user',
} as const
export type COLLECTION = ConstToType<typeof COLLECTION>

/**
 * Cache prefixes
 * @enum
 */
export const CACHE_KEY = {
    ...ARCHIVE,
    POST: POST_TYPE.POST,
    PAGE: POST_TYPE.PAGE,
    BACKGROUNDS: COLLECTION.BACKGROUNDS,
} as const
export type CACHE_KEY = ConstToType<typeof CACHE_KEY>

/**
 * Menu names
 * @enum
 */
export const MENU_NAMES = {
    MAIN: 'main',
    DEV_TOOL: 'devtool',
    ETHER: 'ether',
    ETHER_KOR: 'ether-kor',
} as const
export type MENU_NAMES = ConstToType<typeof MENU_NAMES>

export type T_Option = {
    key: string
    value: string
}

export type T_ShortcodeNamed = Record<string, string>
export type T_ShortcodeAttrMatch = {
    named: T_ShortcodeNamed
    numeric: string[]
}
