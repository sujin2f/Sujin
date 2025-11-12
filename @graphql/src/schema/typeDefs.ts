export const typeDefs = `
type Query{
    recent: [Post]
    backgrounds: [ImageBlock]
    flickr: [FlickrImage]
    tagCloud: [TagCloud]
    spectra(number: Int!, ion: Int!): [Spectrum]
    post(slug: String!, type: String!): Post
    archive(slug: String!, type: String!): Term
}
type Mutation{
    mutatePost(nonce: String!, slug: String!): Result
    mutatePage(nonce: String!, slug: String!): Result
    mutateBackground(nonce: String!): Result
    mutateCategory(nonce: String!, slug: String!): Result
    mutateTag(nonce: String!, slug: String!): Result
    updateHits(slug: String!): Result
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
    id: Int
    slug: String
    title: String
    excerpt: String
    content: String
    date: String
    link: String
    images: Images
    meta: PostMeta
    archives: [Term]
}
type Term {
    _id: String
    title: String
    slug: String
    type: String
    total: Int
    hits: Int
    excerpt: String
    image: ImageBlock
}
`
