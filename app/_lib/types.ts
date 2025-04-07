/**
 * Common type definition
 */

import { ConstToType } from '@common/types'

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
 * Wordpress supported image sizes
 * @enum
 */
export const IMAGE_SIZE = {
    MEDIUM: 'medium',
    THUMBNAI: 'thumbnail',
    MEDIUM_LARGE: 'mediumLarge',
    LARGE: 'large',
    POST_THUMBNAIL: 'postThumbnail',
    RELATED_POST: 'relatedPost',
    RECENT_POST: 'recentPost',
} as const
export type IMAGE_SIZE = ConstToType<typeof IMAGE_SIZE>

/**
 * Type of embed images from Wordpress Post
 * @enum
 */
export const POST_IMAGE_LOCATION = {
    LIST: 'list',
    ICON: 'icon',
    TITLE: 'title',
    BACKGROUND: 'background',
    THUMBNAIL: 'thumbnail',
} as const
export type POST_IMAGE_LOCATION = ConstToType<typeof POST_IMAGE_LOCATION>

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
