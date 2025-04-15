import client, { getCollection } from '@common/data/mongo/mongo'
import { getRandomInt } from '@common/utils/number'
import { IS_TEST, MONGO_DATABASE } from '@common/constants/helper'
import { category, imageBlock, page, post, tag } from './fixture'
import {
    COLLECTION,
    T_ImageBlock,
    T_Archive,
    T_Page,
    T_MongoPost,
} from '@app/_lib/types'

const suffix = IS_TEST ? `-${process.env.JEST_WORKER_ID}` : ''

export const clearMongo = async (...collections: string[]) =>
    await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)

        if (collections.length === 0) {
            await database.collections().then(async (collections) => {
                for (const collection in collections) {
                    if (collections[collection].namespace.includes(suffix)) {
                        await collections[collection].drop()
                    }
                }
            })
            return client
        }

        try {
            for (const collection of collections) {
                await database
                    .collection(`${collection}${suffix}`)
                    .deleteMany({})
            }
        } catch {}

        return client
    })

export const categoryFactory = async (input: Partial<T_Archive> = {}) => {
    const id = getRandomInt(9999999)
    const document = {
        ...category,
        title: `Category ${id}`,
        slug: `category-${id}`,
        ...input,
    }
    const result = await (
        await getCollection(COLLECTION.ARCHIVE)
    ).insertOne(document)

    return {
        ...document,
        _id: result.insertedId,
    }
}

export const tagFactory = async (input: Partial<T_Archive> = {}) => {
    const id = getRandomInt(9999999)
    const document = {
        ...tag,
        title: `Tag ${id}`,
        slug: `tag-${id}`,
        ...input,
    }
    const result = await (
        await getCollection(COLLECTION.ARCHIVE)
    ).insertOne(document)

    return {
        ...document,
        _id: result.insertedId,
    }
}

export const postFactory = async (input: Partial<T_MongoPost> = {}) => {
    const id = getRandomInt(9999999)
    const document = {
        ...post,
        id,
        title: `Post ${id}`,
        slug: `post-${id}`,
        ...input,
    }
    const result = await (
        await getCollection(COLLECTION.POST)
    ).insertOne(document)
    return {
        ...document,
        _id: result.insertedId,
    }
}

export const pageFactory = async (input: Partial<T_Page> = {}) => {
    const id = getRandomInt(9999999)
    const document = {
        ...page,
        id,
        title: `Page ${id}`,
        slug: `page-${id}`,
        ...input,
    }
    const result = await (
        await getCollection(COLLECTION.PAGE)
    ).insertOne(document)
    return {
        ...document,
        _id: result.insertedId,
    }
}

export const backgroundFactory = async (input: Partial<T_ImageBlock> = {}) => {
    const id = getRandomInt(9999999)
    const document = {
        ...imageBlock,
        url: `/wp-content/uploads/test-${id}.jpg`,
        title: `Background ${id}`,
        ...input,
    } satisfies T_ImageBlock
    const result = await (
        await getCollection(COLLECTION.BACKGROUNDS)
    ).insertOne(document)
    return {
        ...document,
        _id: result.insertedId,
    }
}
