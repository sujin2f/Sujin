import type {
    ImageType,
    ImageBlockType,
    ImagesType,
    TermType,
    PostType,
    PageType,
    ArchiveType,
} from '@src/types/wordpress'
import type { OptionType } from '@src/types/mongo'
import { ARCHIVE, POST_STATUS } from '@src/types/wordpress'

const image: { [key in keyof ImageType]: object } = {
    key: {
        bsonType: 'string',
    },
    file: {
        bsonType: 'string',
    },
}

const imageBlock: { [key in keyof ImageBlockType]: object } = {
    mimeType: {
        bsonType: 'string',
    },
    title: {
        bsonType: 'string',
    },
    sizes: {
        bsonType: 'array',
        items: {
            bsonType: 'object',
            properties: image,
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
        enum: [POST_STATUS.PUBLISH, POST_STATUS.DRAFT, POST_STATUS.TRASH],
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
    hits: {
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

const archives = {
    bsonType: 'object',
    title: 'Categories and Tags Collection Validation',
    required: ['id', 'slug', 'title', 'total', 'hits'],
    properties: archivesProperty,
}

const backgrounds = {
    bsonType: 'object',
    title: 'Backgrounds Collection Validation',
    required: ['mimeType', 'title', 'url'],
    properties: imageBlock,
}

const options = {
    bsonType: 'object',
    title: 'Backgrounds Collection Validation',
    required: ['key', 'value'],
    properties: optionsProperty,
}

const defaults = { posts, pages, archives, backgrounds, options }
export default defaults
