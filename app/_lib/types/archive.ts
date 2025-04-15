import { ConstToType } from '@common/types'
import type { T_ImageBlock } from '@app/_lib/types/image'

/**
 * Archive types
 * @enum
 */
export const ARCHIVE = {
    CATEGORY: 'category',
    TAG: 'tag',
    SEARCH: 'search',
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
} as const
export type ARCHIVE_URL = ConstToType<typeof ARCHIVE_URL>

export type T_Archive = {
    title: string
    slug: string
    type: ARCHIVE
    excerpt: string
    image?: T_ImageBlock
    total: number
    hits: number
}

export type T_MySQLArchive = T_Archive & {
    id: number
}
