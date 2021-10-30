/**
 * Constants for GraphQL
 *
 * @module constants
 */

export const graphqlSchema = `
    scalar Date
    type Query {
        getMenu(menuName: String!): [MenuItem]
        getPostsBy(key: String!, value: String!, page: Int): [Post]
        getTermBy(key: String!, value: String!): Term
        getBackgrounds: [Image]
    },
    type MenuItem {
        id: Int
        title: String
        target: String
        link: String
        htmlClass: [String]
        children: [MenuItem]
    },
    type Post {
        id: Int
        slug: String
        title: String
        excerpt: String
        content: String
        date: Date
        link: String
        parent: Int
        type: String
        menuOrder: Int
        tags: [Term]
        categories: [Term]
        series: [Term]
    },
    type Term {
        id: Int
        title: String
        slug: String
        type: String
        total: Int
        limit: Int
        pages: Int
        excerpt: String
    },
    type Image {
        url: String
        mimeType: String
        sizes: [ImageSize]
    }
    type ImageSize {
        key: String
        file: String
    }
`

export const baseQueryNodes = `
    id
    slug
    title
    excerpt
`
