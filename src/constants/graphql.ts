import { gql } from '@apollo/client'
import {
    Image,
    MenuItem,
    Post,
    TagCloud,
    Term,
    TermTypes,
} from 'src/types/wordpress'
import { FlickrImage } from 'src/types/flickr'

export enum Fields {
    BACKGROUNDS = 'backgrounds',
    POST = 'post',
    MENU = 'menu',
    ARCHIVE = 'archive',
    FLICKR = 'flickr',
    TAG_CLOUD = 'tagCloud',
    RECENT = 'recent',
}

export enum Types {}

export const imageQueryNodes = `
    url
    mimeType
    sizes {
        key
        file
    }
`
export const baseQueryNodes = `
    id
    slug
    title
    excerpt
`

export const GraphQuery = {
    BACKGROUNDS: gql`
        query {
            ${Fields.BACKGROUNDS} { ${imageQueryNodes} }
        }
    `,
    POST: gql`
        query ${Fields.POST} ($slug: String!) {
            ${Fields.POST} (slug: $slug) {
                ${baseQueryNodes}
                content
                date
                link
                parent
                type
                menuOrder
                tags {
                    ${baseQueryNodes}
                    page
                    type
                }
                categories {
                    ${baseQueryNodes}
                    page
                    type
                }
                series {
                    ${baseQueryNodes}
                    page
                    type
                }
                meta {
                    useBackgroundColor
                    backgroundColor
                }
                images {
                    id
                    list {
                        ${imageQueryNodes}
                    }
                    icon {
                        ${imageQueryNodes}
                    }
                    title {
                        ${imageQueryNodes}
                    }
                    background {
                        ${imageQueryNodes}
                    }
                    thumbnail {
                        ${imageQueryNodes}
                    }
                }
                prevNext {
                    prev {
                        ${baseQueryNodes}
                        link
                    }
                    next {
                        ${baseQueryNodes}
                        link
                    }
                }
                related {
                    ${baseQueryNodes}
                    date
                    link
                    images {
                        id
                        list {
                            ${imageQueryNodes}
                        }
                        icon {
                            ${imageQueryNodes}
                        }
                        title {
                            ${imageQueryNodes}
                        }
                        background {
                            ${imageQueryNodes}
                        }
                        thumbnail {
                            ${imageQueryNodes}
                        }
                    }
                }
            }
        }
    `,
    MENU: gql`
        query ${Fields.MENU} ($slug: String!) {
            ${Fields.MENU} (slug: $slug) {
                id
                title
                target
                link
                htmlClass
                children {
                    id
                    title
                    target
                    link
                    htmlClass
                }
            }
        }
    `,
    ARCHIVE: gql`
        query ${Fields.ARCHIVE} ($type: String!, $slug: String!, $page: Int!) {
            ${Fields.ARCHIVE} (type: $type, slug: $slug, page: $page) {
                ${baseQueryNodes}
                total
                limit
                pages
                page
                type
                image {
                    ${imageQueryNodes}
                }
                posts {
                    ${baseQueryNodes}
                    date
                    link
                    tags {
                        ${baseQueryNodes}
                        page
                        type
                    }
                    images {
                        id
                        list {
                            ${imageQueryNodes}
                        }
                        background {
                            ${imageQueryNodes}
                        }
                        thumbnail {
                            ${imageQueryNodes}
                        }
                    }
                }
            }
        }
    `,
    FLICKR: gql`
        query {
            ${Fields.FLICKR} {
                title
                link
                media
            }
        }
    `,
    TAG_CLOUD: gql`
        query {
            ${Fields.TAG_CLOUD} {
                id
                title
                slug
                count
                hit
            }
        }
    `,
    RECENT: gql`
        query {
            ${Fields.RECENT} {
                ${baseQueryNodes}
                date
                link
                images {
                    id
                    list {
                        ${imageQueryNodes}
                    }
                    icon {
                        ${imageQueryNodes}
                    }
                    title {
                        ${imageQueryNodes}
                    }
                    background {
                        ${imageQueryNodes}
                    }
                    thumbnail {
                        ${imageQueryNodes}
                    }
                }
            }
        }
    `,
}

export type BackgroundsReturnType = {
    [Fields.BACKGROUNDS]: Image[]
}

export type PostReturnType = {
    [Fields.POST]: Post
}

export type MenuReturnType = {
    [Fields.MENU]: MenuItem[]
}

export type ArchiveReturnType = {
    [Fields.ARCHIVE]: Term
}

export type FlickrReturnType = {
    [Fields.FLICKR]: FlickrImage[]
}

export type TagCloudReturnType = {
    [Fields.TAG_CLOUD]: TagCloud[]
}

export type RecentReturnType = {
    [Fields.RECENT]: Post[]
}

export type ArchiveVariables = {
    type: TermTypes
    slug: string
    page: number
}

export type MenuVariables = {
    slug: string
}

export type PostVariables = {
    slug: string
}

export const graphqlSchema = `
    scalar Date
    type Query {
        ${Fields.BACKGROUNDS}: [Image]
        ${Fields.POST}(slug: String!): Post
        ${Fields.MENU}(slug: String!): [MenuItem]
        ${Fields.ARCHIVE}(type: String!, slug: String!, page: Int!): Term
        ${Fields.FLICKR}: [FlickrImage]
        ${Fields.TAG_CLOUD}: [TagCloud]
        ${Fields.RECENT}: [Post]
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
        images: Images
        meta: PostMeta
        prevNext: PrevNext
        related: [Post]
    },
    type Images {
        id: Int
        list: Image
        icon: Image
        title: Image
        background: Image
        thumbnail: Image
    }
    type PostMeta {
        useBackgroundColor: Boolean
        backgroundColor: String
    }
    type Term {
        id: Int
        title: String
        slug: String
        type: String
        total: Int
        limit: Int
        pages: Int
        excerpt: String
        image: Image
        posts: [Post]
        page: Int
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
    type FlickrImage {
        title: String
        link: String
        media: String
    }
    type TagCloud {
        id: Int
        title: String
        slug: String
        count: Int
        hit: Int
    }
    type PrevNext {
        prev: Post
        next: Post
    }
`
