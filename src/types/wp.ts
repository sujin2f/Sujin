export enum TermTypes {
    category = 'category',
    tag = 'tag',
    post_tag = 'tag',
    search = 'search',
    recent_posts = 'recent-posts',
    series = 'series',
}

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
    // thumbnail: Image
    // meta: PostMeta
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
}

export type ImageSizes = {
    key: string
    file: string
}[]

export type Image = {
    url: string
    mimeType: string
    sizes: ImageSizes
}
