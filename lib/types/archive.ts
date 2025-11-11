import type { WithId } from 'mongodb'
import type { ConstToType } from '@sujin/common/types'
import type { T_ImageBlock } from './image'

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

export type T_Archive = WithId<{
    title: string
    slug: string
    type: ARCHIVE
    excerpt: string
    image?: T_ImageBlock
    total: number
    hits: number
}>

export type T_MySQLArchive = T_Archive & {
    id: number
}
