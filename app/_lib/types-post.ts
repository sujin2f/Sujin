import { T_Term, T_PostImages, POST_STATUS } from '@app/_lib/types'

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
