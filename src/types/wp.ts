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

export type Term = {
    id: number
    name: string
    slug: string
}

export type Background = {
    desktop: string
    mobile: string
}

export const PostGraphQLType = `
    id: Int
    date: String
    content: String
    title: String
    excerpt: String
    parent: Int
    guid: String`

export const MenuItemGraphQLType = `
    ${PostGraphQLType}
    menuOrder: Int
    target: String
    url: String
    type: String
    htmlClass: [String]
    children: [MenuItem]`

export const BackgroundGraphQLType = `
    desktop: String
    mobile: String`
