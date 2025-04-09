import { ConstToType } from '@common/types'
import type { T_ImageBlock } from '@app/_lib/types'

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
// Term: refers the category, tag as a property of post
// Archive: refers the archive page
export type T_Term = {
    id: number
    title: string
    slug: string
    type: ARCHIVE
}

export type T_Category = Omit<T_Term, 'type'> & {
    excerpt: string
    image?: T_ImageBlock
    total: number
}

export type T_Tag = T_Category & {
    hits: number
}

export type T_Archive = T_Category
