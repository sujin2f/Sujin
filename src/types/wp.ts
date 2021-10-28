import { MenuItem } from 'src/frontend/components/layout/MenuItem'

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
}

export type Background = {
    desktop: string
    mobile: string
}
