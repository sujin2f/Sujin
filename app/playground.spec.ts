// yarn test playground.spec.ts

import { Binary } from 'mongodb'
import { hash } from 'node:crypto'
import { getCollection, getDatabase } from '@common/data/mongo/mongo'
import { COLLECTION, T_Archive } from './_lib/types'
import { getAggregation } from '@app/_lib/utils-server'
import { PER_PAGE } from './_lib/data/mysql/constants'
import { categoryFactory } from '@jest/helpers'

async function a() {
    const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
    await collection
        .aggregate<T_Archive>([
            {
                $match: { type: 'category' },
            },
            ...getAggregation('paging', 2),
            ...getAggregation('_id'),
        ])
        .toArray()
}

async function b() {
    const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
    await collection
        .find({ type: 'category' })
        .skip(PER_PAGE * (2 - 1))
        .limit(PER_PAGE)
        .toArray()
        .then((items) =>
            items.map((item) => ({ ...item, _id: item._id.toString() })),
        )
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
    // const testData: string[] = Array(999).fill('')

    test.skip('performance', async () => {
        for (let i = 0; i < 30; i++) {
            await categoryFactory()
        }

        const startTime = performance.now()
        for (let i = 0; i < 300; i++) {
            await a()
            await b()
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

            const h = hash('md5', 'sujin.2f@sujinc.com')

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
