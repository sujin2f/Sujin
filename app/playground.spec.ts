// yarn test playground.spec.ts

import { Binary } from 'mongodb'
import { hash } from 'node:crypto'
import { getDatabase } from '@common/data/mongo/mongo'

function a(data: string) {
    const color = parseInt(data, 16)
    const red = (color >> 16) & 0xff
    const green = (color >> 8) & 0xff
    const blue = color & 0xff

    return [red, green, blue]
}

function b(data: string) {
    const color = parseInt(data, 16)
    const blue = color % 256
    const green = Math.floor((color - blue) / 256) % 256
    const red = Math.floor((color - green) / 65536) % 256

    return [red, green, blue]
}

function c(data: string) {
    const red = parseInt(data.slice(0, 2), 16)
    const green = parseInt(data.slice(2, 4), 16)
    const blue = parseInt(data.slice(4, 6), 16)

    return [red, green, blue]
}

function perform(data: string[], ...callback: ((data: string) => unknown)[]) {
    callback.forEach((cb) => {
        const startTime = performance.now()
        data.forEach((item) => cb(item))
        const endTime = performance.now()
        console.log(
            `Call to doSomething took ${endTime - startTime} milliseconds`,
        )
    })
}

describe('Performance Test', () => {
    const testData: string[] = []

    test.skip('performance', async () => {
        const white = parseInt('FFFFFF', 16)
        Array(white)
            .fill(0)
            .forEach((_, i) => {
                testData.push(i.toString(16).padStart(6, '0'))
            })

        perform(testData, a, b, c)
        expect(true).toBeTruthy()
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
