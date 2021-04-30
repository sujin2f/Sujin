export type Post = {
    id: number
    date: string
    content: string
    title: string
    excerpt: string
    parent: number
    guid: string
    menuOrder: number
}

export type MenuItem = {
    target: string
    url: string
    type: string
    objectId: number
    htmlClass: string[]
    children: MenuItem[]
} & Post

export type Term = {
    id: number
    name: string
    slug: string
}
