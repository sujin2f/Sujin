import type {
    T_Image,
    T_ImageBlock,
    T_Option,
    T_PostImages,
    T_Page,
    T_PrevNext,
} from '@app/_lib/types'
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

const prevNextProperty: { [key in keyof T_PrevNext]: object } = {
    title: {
        bsonType: 'string',
    },
    link: {
        bsonType: 'string',
    },
}

const terms = {
    bsonType: 'array',
    items: {
        bsonType: 'object',
        properties: term,
    },
}
const meta = {
    bsonType: 'object',
    properties: {
        useBackgroundColor: { bsonType: 'bool' },
        backgroundColor: { bsonType: 'string' },
    },
}
const content = {
    bsonType: 'string',
}

const archivePostProperty = {
    ...prevNextProperty,
    id: {
        bsonType: 'int',
    },
    slug: {
        bsonType: 'string',
    },
    excerpt: {
        bsonType: 'string',
    },
    date: {
        bsonType: 'date',
    },
    images: {
        bsonType: 'object',
        properties: images,
    },
    status: {
        bsonType: 'string',
        enum: [...Object.values(POST_STATUS)],
    },
}

const pageProperty: { [key in keyof T_Page]: object } = {
    ...archivePostProperty,
    content,
    meta,
}

const postProperty = {
    ...archivePostProperty,
    content,
    meta,
    terms,
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

const optionsProperty: { [key in keyof T_Option]: object } = {
    key: {
        bsonType: 'string',
    },
    value: {
        bsonType: 'string',
    },
}

const prevNext = {
    bsonType: 'object',
    required: ['title', 'link'],
    properties: prevNextProperty,
}

const archivePost = {
    bsonType: 'object',
    required: ['title', 'link'],
    properties: {
        ...archivePostProperty,
        terms,
    },
}

const post = {
    bsonType: 'object',
    title: 'Posts Collection Validation',
    required: ['id', 'slug', 'title', 'date', 'content', 'status', 'link'],
    properties: postProperty,
}

const page = {
    bsonType: 'object',
    title: 'Pages Collection Validation',
    required: ['id', 'slug', 'title', 'date', 'content', 'status', 'link'],
    properties: pageProperty,
}

const category = {
    bsonType: 'object',
    title: 'Categories and Tags Collection Validation',
    required: ['id', 'slug', 'title', 'total'],
    properties: archivesProperty,
}

const tag = {
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

const background = {
    bsonType: 'object',
    title: 'Backgrounds Collection Validation',
    required: ['mimeType', 'url'],
    properties: imageBlock,
}

const option = {
    bsonType: 'object',
    title: 'Backgrounds Collection Validation',
    required: ['key', 'value'],
    properties: optionsProperty,
}

const defaults = {
    prevNext,
    archivePost,
    post,
    page,
    category,
    tag,
    background,
    option,
}
export default defaults
