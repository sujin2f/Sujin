import { ConstToType } from '@common/types'
import { T_Term, T_PostImages } from '@app/_lib/types'

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
    title: string
    link: string
}

export type T_Post = T_PrevNext & {
    id: number
    slug: string
    excerpt: string
    content: string
    date: number
    terms: T_Term[]
    images: T_PostImages
    meta: {
        useBackgroundColor: boolean
        backgroundColor: string
    }
    status: POST_STATUS
}

export type T_MySQLPost = T_Post & {
    mimeType: string
    type: string
}

export type T_Page = Omit<T_Post, 'terms'>
