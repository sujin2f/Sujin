import { ConstToType } from '@common/types'
import type { T_ImageBlock } from '@app/_lib/types/image'
import type { T_PostArchive } from '@app/_lib/types/post'

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
// Term: refers the category, tag as a property of post
// Archive: refers the archive page
export type T_Term = {
    id: number
    title: string
    slug: string
    type: ARCHIVE
}

export type T_Archive = Omit<T_Term, 'type'> & {
    excerpt: string
    image?: T_ImageBlock
    total: number
    page?: number
    posts?: T_PostArchive[]
}

export type T_Tag = T_Archive & {
    hits: number
}

export type T_Category = T_Archive
