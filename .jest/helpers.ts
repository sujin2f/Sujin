import Mongo from '../common/data/mongo/mongo'
import client from '../common/data/mongo/mongo-client'
import { getRandomInt } from '../common/utils/number'
import { MONGO_DATABASE } from '../common/constants/helper'
import { COLLECTION } from '../src/constants/mongo'
import type {
    ArchiveType,
    ImageBlockType,
    PageType,
    PostType,
} from '../src/types/wordpress'
import { post } from './fixture'

export const clearMongo = async (...collections: string[]) =>
    await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        if (collections.length === 0) {
            await database.dropDatabase()
            return client
        }
        try {
            for (const collection of collections) {
                await database.collection(collection).deleteMany({})
            }
        } catch {}

        return client
    })

export const categoryFactory = async (input: Partial<ArchiveType> = {}) => {
    const id = getRandomInt(10000)
    const document = {
        id,
        title: `Category ${id}`,
        slug: `category-${id}`,
        excerpt: '',
        total: 0,
        hits: 0,
        ...input,
    }
    const result = await Mongo.insertOne(COLLECTION.CATEGORY, document)

    return {
        ...document,
        _id: result.insertedId,
    }
}

export const tagFactory = async (input: Partial<ArchiveType> = {}) => {
    const id = getRandomInt(10000)
    const document = {
        id,
        title: `Tag ${id}`,
        slug: `tag-${id}`,
        excerpt: '',
        total: 0,
        hits: 0,
        ...input,
    }
    const result = await Mongo.insertOne(COLLECTION.TAG, document)

    return {
        ...document,
        _id: result.insertedId,
    }
}

export const postFactory = async (input: Partial<PostType> = {}) => {
    const id = getRandomInt(10000)
    const document = {
        ...post,
        id,
        title: `Post ${id}`,
        slug: `post-${id}`,
        ...input,
    }
    const result = await Mongo.insertOne(COLLECTION.POST, document)

    return {
        ...document,
        _id: result.insertedId,
    }
}

export const pageFactory = async (input: Partial<PageType> = {}) => {
    const id = getRandomInt(10000)
    const document = {
        ...post,
        id,
        title: `Page ${id}`,
        slug: `page-${id}`,
        ...input,
    }
    const result = await Mongo.insertOne(COLLECTION.PAGE, document)
    return {
        ...document,
        _id: result.insertedId,
    }
}

export const backgroundFactory = async (
    input: Partial<ImageBlockType> = {},
) => {
    const id = getRandomInt(10000)
    const document = {
        title: `Background ${id}`,
        mimeType: 'image/jpeg',
        sizes: [
            {
                key: 'medium',
                file: `http://test.test/image-medium-${id}.jpeg`,
            },
            {
                key: 'thumbnail',
                file: `http://test.test/image-thumbnail-${id}.jpeg`,
            },
            {
                key: 'medium_large',
                file: `http://test.test/image-medium_large-${id}.jpeg`,
            },
            {
                key: 'post-thumbnail',
                file: `http://test.test/image-post-thumbnail-${id}.jpeg`,
            },
            {
                key: 'related-post',
                file: `http://test.test/image-related-post-${id}.jpeg`,
            },
            {
                key: 'recent-post',
                file: `http://test.test/image-recent-post-${id}.jpeg`,
            },
        ],
        url: `http://test.test/image-${id}.jpeg`,
        ...input,
    } satisfies ImageBlockType
    const result = await Mongo.insertOne(COLLECTION.BACKGROUNDS, document)
    return {
        ...document,
        _id: result.insertedId,
    }
}
