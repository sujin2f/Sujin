import type { T_ImageBlock } from './image'
import { ARCHIVE, GQL_QUERY_TYPE } from '../constants'

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

export type GQL_SlugArg = {
    slug: string
}

export type GQL_ArchiveArg = Partial<GQL_SlugArg> & {
    archiveType: ARCHIVE.CATEGORY | ARCHIVE.TAG
    page?: number
    query: GQL_QUERY_TYPE
}
