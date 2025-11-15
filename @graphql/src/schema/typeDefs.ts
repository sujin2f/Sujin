export const typeDefs = `
type Query{
    recent: [Post]
    prevNext(slug: String!): [Post]
    related(slug: String!): [Post]
    
    post(postType: POST_TYPE!, slug: String, category: String, page: Int): [Post]


    archivePosts(id: String!, page: Int!, bypassCache: Boolean!): [Post]
    pages(page: Int!): [Post]

    backgrounds(bypassCache: Boolean!): [ImageBlock]

    flickr: [FlickrImage]
    tagCloud: [TagCloud]
    spectra(number: Int!, ion: Int!): [Spectrum]

    numPages(context: String!, id: String, type: ARCHIVE_TYPE): Int

    archive(slug: String, archiveType: ARCHIVE_TYPE!, page: Int): [Archive]
}
type Mutation{
    updatePostsFromWP(slug: String!, page: Int!): Result

    mutatePost(nonce: String!, slug: String!): Result
    mutatePage(slug: String!): Result
    removePage(slug: String!): Result

    mutateBackgrounds(nonce: String!): Result

    login(email: String!): String
    flushDB: Boolean


    updateHits(slug: String!): Result
    updateArchive(slug: String!, archiveType: ARCHIVE_TYPE!): [Boolean]
    removeArchive(slug: String!, archiveType: ARCHIVE_TYPE!): [Boolean]
}
enum POST_TYPE {
    post
    page
}
enum ARCHIVE_TYPE {
    category
    tag
}
type FlickrImage {
    title: String
    link: String
    media: String
}
type TagCloud {
    id: Int
    title: String
    slug: String
    total: Int
    hits: Int
}
type Result {
    result: Boolean
}
type Spectrum {
    number: Int
    ion: Int
    energy: Float
    spin: Float
    l: String
    parity: Boolean
    j: Float
    base: Float
    conf: [String]
    eConf: [Int]
    ionReverse: Int
    position: Int
    term: String
    orbital: String
}
type Image {
    url: String
    width: Int
    height: Int
    mimeType: String
}
type ImageSize {
    medium: Image
    mediumLarge: Image
    large: Image
    thumbnail: Image
    postThumbnail: Image
    relatedPost: Image
    recentPost: Image
}
type ImageBlock {
    _id: String
    url: String
    mimeType: String
    width: Int
    height: Int
    sizes: ImageSize
}
type Images {
    list: ImageBlock
    icon: ImageBlock
    title: ImageBlock
    background: ImageBlock
    thumbnail: ImageBlock
}
type PostMeta {
    useBackgroundColor: Boolean
    backgroundColor: String
}
type Post {
    _id: String
    id: Int
    slug: String
    title: String
    excerpt: String
    content: String
    date: String
    link: String
    images: Images
    meta: PostMeta
    archives: [Archive]
    status: String
}
type Archive {
    _id: String
    title: String
    slug: String
    type: ARCHIVE_TYPE
    total: Int
    hits: Int
    excerpt: String
    image: ImageBlock
}
`
