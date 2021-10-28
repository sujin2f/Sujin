export const PostGraphQLType = `
    id: Int
    slug: String
    date: String
    content: String
    title: String
    excerpt: String
    parent: Int
    type: String
    menuOrder: Int
    guid: String`

export const MenuItemGraphQLType = `
    ${PostGraphQLType}
    target: String
    url: String
    htmlClass: [String]
    children: [MenuItem]`

export const BackgroundGraphQLType = `
    desktop: String
    mobile: String`
