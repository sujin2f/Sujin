import type {
    ImageType,
    ImageBlockType,
    ImagesType,
    TermType,
    PostType,
    PageType,
    ArchiveType,
} from '@app/_lib/data/mysql/types'
import type { OptionType } from '@app/_lib/data/mongo/types'
import { ARCHIVE, POST_STATUS } from '@app/_lib/types'

const image: { [key in keyof ImageType]: object } = {
    url: {
        bsonType: 'string',
    },
    width: {
        bsonType: 'int',
    },
    height: {
        bsonType: 'int',
    },
    mimeType: {
        bsonType: 'string',
    },
}

const imageBlock: { [key in keyof ImageBlockType]: object } = {
    title: {
        bsonType: 'string',
    },
    mimeType: {
        bsonType: 'string',
    },
    width: {
        bsonType: 'int',
    },
    height: {
        bsonType: 'int',
    },
    sizes: {
        bsonType: 'object',
        properties: {
            medium: {
                bsonType: 'object',
                properties: image,
            },
            thumbnail: {
                bsonType: 'object',
                properties: image,
            },
            mediumLarge: {
                bsonType: 'object',
                properties: image,
            },
            postThumbnail: {
                bsonType: 'object',
                properties: image,
            },
            relatedPost: {
                bsonType: 'object',
                properties: image,
            },
            recentPost: {
                bsonType: 'object',
                properties: image,
            },
        },
    },
    url: {
        bsonType: 'string',
    },
}

const images: { [key in keyof ImagesType]: object } = {
    list: {
        bsonType: 'object',
        properties: imageBlock,
    },
    icon: {
        bsonType: 'object',
        properties: imageBlock,
    },
    title: {
        bsonType: 'object',
        properties: imageBlock,
    },
    background: {
        bsonType: 'object',
        properties: imageBlock,
    },
    thumbnail: {
        bsonType: 'object',
        properties: imageBlock,
    },
}

const term: { [key in keyof TermType]: object } = {
    id: {
        bsonType: 'int',
    },
    slug: {
        bsonType: 'string',
    },
    title: {
        bsonType: 'string',
    },
    type: {
        bsonType: 'string',
        enum: [ARCHIVE.CATEGORY, ARCHIVE.TAG],
    },
}

const pageProperty: { [key in keyof PageType]: object } = {
    id: {
        bsonType: 'int',
    },
    slug: {
        bsonType: 'string',
    },
    title: {
        bsonType: 'string',
    },
    excerpt: {
        bsonType: 'string',
    },
    date: {
        bsonType: 'date',
    },
    content: {
        bsonType: 'string',
    },
    status: {
        bsonType: 'string',
        enum: [...Object.values(POST_STATUS)],
    },
    images: {
        bsonType: 'object',
        properties: images,
    },
    meta: {
        bsonType: 'object',
        properties: {
            useBackgroundColor: { bsonType: 'bool' },
            backgroundColor: { bsonType: 'string' },
        },
    },
    link: {
        bsonType: 'string',
    },
}

const postProperty: { [key in keyof PostType]: object } = {
    ...pageProperty,
    terms: {
        bsonType: 'array',
        items: {
            bsonType: 'object',
            properties: term,
        },
    },
}

const archivesProperty: { [key in keyof ArchiveType]: object } = {
    id: {
        bsonType: 'int',
    },
    slug: {
        bsonType: 'string',
    },
    title: {
        bsonType: 'string',
    },
    excerpt: {
        bsonType: 'string',
    },
    image: {
        bsonType: 'object',
        properties: imageBlock,
    },
    total: {
        bsonType: 'int',
    },
}

const optionsProperty: { [key in keyof OptionType]: object } = {
    key: {
        bsonType: 'string',
    },
    value: {
        bsonType: 'string',
    },
}

const posts = {
    bsonType: 'object',
    title: 'Posts Collection Validation',
    required: ['id', 'slug', 'title', 'date', 'content', 'status'],
    properties: postProperty,
}

const pages = {
    bsonType: 'object',
    title: 'Pages Collection Validation',
    required: ['id', 'slug', 'title', 'date', 'content', 'status'],
    properties: pageProperty,
}

const category = {
    bsonType: 'object',
    title: 'Categories and Tags Collection Validation',
    required: ['id', 'slug', 'title', 'total'],
    properties: archivesProperty,
}

const tags = {
    bsonType: 'object',
    title: 'Tag Collection Validation',
    required: ['id', 'slug', 'title', 'total', 'hits'],
    properties: {
        ...archivesProperty,
        hits: {
            bsonType: 'int',
        },
    },
}

const backgrounds = {
    bsonType: 'object',
    title: 'Backgrounds Collection Validation',
    required: ['mimeType', 'url'],
    properties: imageBlock,
}

const options = {
    bsonType: 'object',
    title: 'Backgrounds Collection Validation',
    required: ['key', 'value'],
    properties: optionsProperty,
}

/**
 * @deprecated
 */
const archives = {
    ...tags,
}

const defaults = {
    posts,
    pages,
    archives,
    category,
    tags,
    backgrounds,
    options,
}
export default defaults
