import type {
    T_Image,
    T_ImageBlock,
    T_Option,
    T_PostImages,
    T_Page,
    T_PrevNext,
    T_ArchivePost,
    T_Archive,
    T_Snippet,
    T_Snippet_User,
    T_Snippets,
    T_Post,
    T_Background,
    T_User,
    T_Recipe,
} from '@app/_lib/types'
import { ARCHIVE, POST_STATUS, UNITS } from '@app/_lib/types'
import { languages } from '@common/constants/helper'
import type {
    T_Mongo,
    T_MongoSchema,
    T_MongoSchemaProperties,
} from '@common/types/mongo'
import type { WithId } from 'mongodb'

const image: T_MongoSchemaProperties<T_Image> = {
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

const imageBlock: T_MongoSchemaProperties<T_ImageBlock> = {
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

const images: T_MongoSchemaProperties<T_PostImages> = {
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

const prevNextProperty: T_MongoSchemaProperties<T_PrevNext> = {
    title: {
        bsonType: 'string',
    },
    link: {
        bsonType: 'string',
    },
}

const archivePostProperty: T_MongoSchemaProperties<
    Omit<T_ArchivePost, 'archives'>
> = {
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

const pageProperty: T_MongoSchemaProperties<T_Page> = {
    ...archivePostProperty,
    content: {
        bsonType: 'string',
    },
    meta: {
        bsonType: 'object',
        properties: {
            useBackgroundColor: { bsonType: 'bool' },
            backgroundColor: { bsonType: 'string' },
        },
    },
}

const postProperty: T_MongoSchemaProperties<T_Mongo<T_Post>> = {
    ...archivePostProperty,
    content: {
        bsonType: 'string',
    },
    meta: {
        bsonType: 'object',
        properties: {
            useBackgroundColor: { bsonType: 'bool' },
            backgroundColor: { bsonType: 'string' },
        },
    },
    archives: {
        bsonType: 'array',
        items: {
            bsonType: 'objectId',
        },
    },
}

const archivesProperty: T_MongoSchemaProperties<T_Archive> = {
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
    type: {
        bsonType: 'string',
        enum: [ARCHIVE.CATEGORY, ARCHIVE.TAG],
    },
    total: {
        bsonType: 'int',
    },
    hits: {
        bsonType: 'int',
    },
}

const post: T_MongoSchema<T_Mongo<T_Post>> = {
    bsonType: 'object',
    title: 'Posts Collection Validation',
    required: ['id', 'slug', 'title', 'date', 'content', 'status', 'link'],
    properties: postProperty,
}

const page: T_MongoSchema<T_Mongo<WithId<T_Page>>> = {
    bsonType: 'object',
    title: 'Pages Collection Validation',
    required: ['id', 'slug', 'title', 'date', 'content', 'status', 'link'],
    properties: pageProperty,
}

const archive: T_MongoSchema<T_Mongo<T_Archive>> = {
    bsonType: 'object',
    title: 'Archive Collection Validation',
    required: ['slug', 'title', 'type'],
    properties: {
        ...archivesProperty,
    },
}

const background: T_MongoSchema<T_Mongo<T_Background>> = {
    bsonType: 'object',
    title: 'Backgrounds Collection Validation',
    required: ['mimeType', 'url'],
    properties: imageBlock,
}

const option: T_MongoSchema<T_Mongo<T_Option>> = {
    bsonType: 'object',
    title: 'Backgrounds Collection Validation',
    required: ['key', 'value'],
    properties: {
        key: {
            bsonType: 'string',
        },
        value: {
            bsonType: 'string',
        },
    },
}

const abTest = {
    bsonType: 'object',
    required: ['key', 'value'],
    properties: {
        name: {
            bsonType: 'string',
        },
        type: {
            bsonType: 'string',
            enum: ['a', 'b'],
        },
        time: {
            bsonType: 'double',
        },
    },
}

const snippets: T_MongoSchema<T_Mongo<T_Snippets>> = {
    bsonType: 'object',
    required: ['user', 'title', 'snippets'],
    properties: {
        user: {
            bsonType: 'objectId',
        },
        title: {
            bsonType: 'string',
        },
        snippets: {
            bsonType: 'array',
            items: {
                bsonType: 'objectId',
            },
        },
        tags: {
            bsonType: 'array',
            items: {
                bsonType: 'string',
            },
        },
    },
}

const snippet: T_MongoSchema<T_Mongo<T_Snippet>> = {
    bsonType: 'object',
    required: ['code', 'type'],
    properties: {
        code: {
            bsonType: 'string',
        },
        type: {
            bsonType: 'string',
            enum: [...languages],
        },
    },
}

const snippetsUser: T_MongoSchema<T_Mongo<T_Snippet_User>> = {
    bsonType: 'object',
    required: ['user', 'snippets'],
    properties: {
        user: {
            bsonType: 'objectId',
        },
        snippets: {
            bsonType: 'objectId',
        },
    },
}

const users: T_MongoSchema<T_Mongo<T_User>> = {
    bsonType: 'object',
    required: ['email'],
    properties: {
        email: {
            bsonType: 'binData',
        },
        name: {
            bsonType: 'binData',
        },
        image: {
            bsonType: 'string',
        },
    },
}

const recipe: T_MongoSchema<T_Mongo<T_Recipe>> = {
    bsonType: 'object',
    required: ['title', 'user'],
    properties: {
        title: {
            bsonType: 'string',
        },
        url: {
            bsonType: 'string',
        },
        search: {
            bsonType: 'string',
        },
        ingredients: {
            bsonType: 'array',
            items: {
                bsonType: 'object',
                properties: {
                    title: {
                        bsonType: 'string',
                    },
                    amount: {
                        bsonType: 'double',
                    },
                    unit: {
                        bsonType: 'string',
                        enum: UNITS,
                    },
                },
            },
        },
        user: {
            bsonType: 'objectId',
        },
    },
}

const defaults = {
    post,
    page,
    background,
    option,
    archive,
    abTest,
    snippets,
    snippet,
    snippetsUser,
    users,
    recipe,
}
export default defaults
