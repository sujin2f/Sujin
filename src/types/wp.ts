import { MenuItem } from 'src/frontend/components/layout/MenuItem'

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

export const MenuItemGraphQLType = `
type MenuItem {
    id: Int
    date: String
    content: String
    title: String
    excerpt: String
    parent: Int
    guid: String
    menuOrder: Int
    target: String
    url: String
    type: String
    htmlClass: [String]
    children: [MenuItem]
}
`

export type Term = {
    id: number
    name: string
    slug: string
}
