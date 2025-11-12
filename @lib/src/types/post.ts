import type { ConstToType } from '@sujin/share/types'
import type { T_PostImages } from './image'
import type { T_Archive } from './archive'

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

// Post and Page
export type T_PrevNext = {
    _id: string
    title: string
    link: string
}

export type T_ArchivePost = T_PrevNext & {
    id: number
    slug: string
    excerpt: string
    date: Date
    images: T_PostImages
    status: POST_STATUS
    archives: T_Archive[]
}

export type T_Post = T_ArchivePost & {
    content: string
    meta: {
        useBackgroundColor: boolean
        backgroundColor: string
    }
}

export type T_MySQLPost = T_Post & {
    terms: T_Archive[]
    mimeType: string
    type: string
}

export type T_Page = Omit<T_Post, 'archives'>
