// @todo move to parent since it's used across the service
import type { ARCHIVE, POST_STATUS } from '@app/_lib/types'
import type { T_ImageBlock, T_PostImages } from '@app/_lib/types-image'

// Term: refers the category, tag as a property of post
// Archive: refers the archive page
export type TermType = {
    id: number
    title: string
    slug: string
    type: ARCHIVE
}

export type CategoryType = Omit<TermType, 'type'> & {
    excerpt: string
    image?: T_ImageBlock
    total: number
}

export type TagType = CategoryType & {
    hits: number
}

export type ArchiveType = CategoryType

// Post and Page
export type T_PrevNext = {
    title: string
    link: string
}

export type PostType = T_PrevNext & {
    id: number
    slug: string
    excerpt: string
    content: string
    date: number
    terms: TermType[]
    images: T_PostImages
    meta: {
        useBackgroundColor: boolean
        backgroundColor: string
    }
    status: POST_STATUS
}

export type MySQLPostType = PostType & {
    mimeType: string
    type: string
}

export type PageType = Omit<PostType, 'terms'>

export type OptionType = { option_value: string }

export type PostMetaType = {
    meta_key: string
    meta_value: string
}

export type Named = Record<string, string>
export type AttrMatch = { named: Named; numeric: string[] }
