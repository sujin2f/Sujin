import type { T_PostImages, T_Archive } from '.'
import { POST_STATUS } from '../constants'

// Post and Page
export type T_PrevNext = {
    _id?: string
    title: string
    link: string
}

export type T_ArchivePost = T_PrevNext & {
    id: number
    slug: string
    excerpt: string
    date: number
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

export type T_MySQLPost = Omit<T_Post, 'date'> & {
    date: Date
    terms: T_Archive[]
    mimeType: string
    type: string
}

export type T_Page = Omit<T_Post, 'archives'>

export type WithNumPages<T, N extends string> = {
    readonly numPages: number
} & {
    [key in N]: T[]
}
