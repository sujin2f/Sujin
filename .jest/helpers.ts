import Mongo from '@common/data/mongo/mongo'
import client from '@common/data/mongo/mongo-client'
import { getRandomInt } from '@common/utils/number'
import { MONGO_DATABASE } from '@common/constants/helper'
import type {
    ArchiveType,
    ImageBlockType,
    PageType,
    PostType,
} from '@app/_lib/data/mysql/types'
import { category, imageBlock, page, post, tag } from './fixture'
import { COLLECTION } from '@app/_lib/data/types'

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
        ...category,
        id,
        title: `Category ${id}`,
        slug: `category-${id}`,
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
        ...tag,
        id,
        title: `Tag ${id}`,
        slug: `tag-${id}`,
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
        ...page,
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
        ...imageBlock,
        url: `/wp-content/uploads/test-${id}.jpg`,
        title: `Background ${id}`,
        ...input,
    } satisfies ImageBlockType
    const result = await Mongo.insertOne(COLLECTION.BACKGROUNDS, document)
    return {
        ...document,
        _id: result.insertedId,
    }
}
