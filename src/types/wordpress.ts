import { TermTypes } from '@src/constants/wordpress'

export type ImageKeys = 'list' | 'icon' | 'title' | 'background' | 'thumbnail'

export type Post = {
    id: number
    slug: string
    title: string
    excerpt: string
    content: string
    date: number
    link: string
    parent: number
    type: 'post' | 'page' | 'attachment'
    menuOrder: number
    tags: Term[]
    categories: Term[]
    series: Term[]
    mimeType: string
    images: {
        id: number
        list?: Image
        icon?: Image
        title?: Image
        background?: Image
        thumbnail?: Image
    }
    meta: {
        useBackgroundColor: boolean
        backgroundColor: string
    }
    status: 'publish' | 'draft' | 'inherit'
}

export type MenuItem = {
    id: number
    title: string
    target: string
    link: string
    htmlClass: string[]
    children: MenuItem[]
    parent: number
}

export type Term = {
    id: number
    title: string
    slug: string
    type: TermTypes
    excerpt: string
    image?: Image
    total: number
}

export type ImageSize = {
    key: string
    file: string
}

export type ImageSizes = ImageSize[]

export type Image = {
    url: string
    mimeType: string
    title: string
    sizes: ImageSizes
}

export type TagCloud = {
    id: number
    title: string
    slug: string
    count: number
    hit: number
}

export type MediaRawData = {
    file: string
    sizes: Record<string, { file: string }>
}

export type PostMeta = {
    meta_key: string
    meta_value: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OptionValue = Record<string, any> | string | number | boolean

export type Named = Record<string, string>
export type AttrMatch = { named: Named; numeric: string[] }

export type ArchiveProp = {
    type: TermTypes
    slug: string
    page: number
}
