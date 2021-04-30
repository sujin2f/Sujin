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
