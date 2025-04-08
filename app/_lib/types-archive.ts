import type { T_ImageBlock, ARCHIVE } from '@app/_lib/types'

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
