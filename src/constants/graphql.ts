export const PostGraphQLType = `
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
`

export const MenuItemGraphQLType = `
    id: Int
    title: String
    target: String
    link: String
    htmlClass: [String]
    children: [MenuItem]
`

export const BackgroundGraphQLType = `
    desktop: String
    mobile: String
`
