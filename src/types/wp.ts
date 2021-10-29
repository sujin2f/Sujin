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
    name: string
    slug: string
    type: TermTypes
}

export type Background = {
    desktop: string
    mobile: string
}
