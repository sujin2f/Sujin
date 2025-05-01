// yarn test playground.spec.ts

import { Binary } from 'mongodb'
import { createHash } from 'node:crypto'
import { findOne, getCollection, getDatabase } from '@common/data/mongo/mongo'
import { COLLECTION, T_Archive, T_Post } from './types'
import { getAggregation } from '@app/_lib/utils/server'
// import { PER_PAGE } from './_lib/data/mysql/constants'
import { categoryFactory, postFactory } from '@jest/helpers'
import { T_Mongo, T_Stringify } from '@common/types/mongo'

async function a(slug: string) {
    const collection = await getCollection<T_Post>(COLLECTION.POST)
    const result = await collection
        .aggregate<T_Stringify<T_Post, 'archives'>>([
            {
                $match: {
                    slug,
                },
            },
            ...getAggregation('_id'),
            ...getAggregation('expand-archive'),
        ])
        .toArray()
    return result[0]
}

async function b(slug: string) {
    return await findOne<T_Mongo<T_Post>>(COLLECTION.POST, {
        slug,
    }).then(async (post) => {
        const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
        const archives = await collection
            .find({ _id: { $in: post.archives } })
            .map((archive) => ({ ...archive, _id: archive._id.toString() }))
            .toArray()

        return {
            ...post,
            _id: post._id.toString(),
            archives,
        }
    })
}

// function perform(data: string[], ...callback: (() => unknown)[]) {
//     callback.forEach((cb) => {
//         const startTime = performance.now()
//         data.forEach(() => cb())
//         const endTime = performance.now()
//         console.log(
//             `Call to doSomething took ${endTime - startTime} milliseconds`,
//         )
//     })
// }

describe('Performance Test', () => {
    test.skip('performance', async () => {
        const category1 = await categoryFactory()
        const category2 = await categoryFactory()
        const category3 = await categoryFactory()
        const category4 = await categoryFactory()
        const category5 = await categoryFactory()

        const testData: string[] = []

        for (let i = 0; i < 100; i++) {
            const post = await postFactory({
                archives: [
                    category1._id,
                    category2._id,
                    category3._id,
                    category4._id,
                    category5._id,
                ],
            })
            testData.push(post.slug)
        }

        // for (let i = 0; i < 30; i++) {
        //     await categoryFactory()
        // }

        await a(testData[0])
        const startTime = performance.now()
        for (let i = 0; i < 100; i++) {
            // await a(testData[i])
            await b(testData[i])
        }
        const endTime = performance.now()
        console.log(
            `Call to doSomething took ${endTime - startTime} milliseconds`,
        )

        expect(true).toBeTruthy()
        // perform(testData, a)
    })

    test.skip('playground', async () => {
        // Permissions
        const userPermission = parseInt('111', 2)
        const isAdmin = (userPermission >> 2) & 1
        const isWrite = (userPermission >> 1) & 1
        const isRead = userPermission & 1
        console.log(isAdmin, isWrite, isRead)

        const userPermission2 = parseInt('011', 2)
        const isAdmin2 = (userPermission2 >> 2) & 1
        const isWrite2 = (userPermission2 >> 1) & 1
        const isRead2 = userPermission2 & 1
        console.log(isAdmin2, isWrite2, isRead2)

        const userPermission3 = parseInt('001', 2)
        const isAdmin3 = (userPermission3 >> 2) & 1
        const isWrite3 = (userPermission3 >> 1) & 1
        const isRead3 = userPermission3 & 1
        console.log(isAdmin3, isWrite3, isRead3)

        const userPermission4 = parseInt('000', 2)
        const isAdmin4 = (userPermission4 >> 2) & 1
        const isWrite4 = (userPermission4 >> 1) & 1
        const isRead4 = userPermission4 & 1
        console.log(isAdmin4, isWrite4, isRead4)

        // md5 and binary field in mongo binData
        await getDatabase().then(async (db) => {
            await db.createCollection('test', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        properties: {
                            value: {
                                bsonType: 'binData',
                            },
                        },
                    },
                },
            })

            const h = createHash('md5')
                .update('sujin.2f@sujinc.com')
                .digest('hex')

            const inserted = await db.collection('test').insertOne({
                value: new Binary(Buffer.from(h), Binary.SUBTYPE_MD5),
            })

            const result = await db
                .collection('test')
                .findOne({ _id: inserted.insertedId })
            console.log(result!.value.toString('utf8'), h)

            await db.dropDatabase()
        })

        expect(true).toBeTruthy()
    })

    test('to prevent empty test error', async () => {
        expect(true).toBeTruthy()
    })
})
