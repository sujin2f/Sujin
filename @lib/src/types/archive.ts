import { ARCHIVE } from '../constants'
import type { T_ImageBlock } from '.'

export type T_Archive = {
    _id: string
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

export type T_RestArchive = {
    name: string
    slug: string
    taxonomy: ARCHIVE
    description: string
    count: number
    thumbnail?: T_ImageBlock
}
