import type { T_Image, T_ImageBlock, T_PostImages } from '@app/_lib/types'
import { ARCHIVE, POST_STATUS } from '@app/_lib/types'

const image: { [key in keyof T_Image]: object } = {
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

const imageBlock: { [key in keyof T_ImageBlock]: object } = {
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
            large: {
                bsonType: 'object',
                properties: image,
            },
        },
    },
    url: {
        bsonType: 'string',
    },
}

const images: { [key in keyof T_PostImages]: object } = {
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

const term = {
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

const pageProperty = {
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

const postProperty = {
    ...pageProperty,
    terms: {
        bsonType: 'array',
        items: {
            bsonType: 'object',
            properties: term,
        },
    },
}

const archivesProperty = {
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

const optionsProperty = {
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

const defaults = {
    posts,
    pages,
    category,
    tags,
    backgrounds,
    options,
}
export default defaults
