export enum TermTypes {
    category = 'category',
    tag = 'tag',
    post_tag = 'tag',
    search = 'search',
    recent_posts = 'recent-posts',
    series = 'series',
}

export type ImageKeys = 'list' | 'icon' | 'title' | 'background' | 'thumbnail'

export type Post = {
    id: number
    slug: string
    title: string
    excerpt: string
    content: string
    date: string
    link: string
    parent: number
    type: string
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
    prevNext: {
        prev?: Post
        next?: Post
    }
    related: Post[]
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
    total: number
    limit: number
    pages: number
    excerpt: string
    image?: Image
    posts: Post[]
    page: number
}

export type ImageSizes = {
    key: string
    file: string
}[]

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

export type OptionValue = Record<string, any> | string | number | boolean
