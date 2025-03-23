// yarn test mongo.spec.ts

import Mongo, { migrateIndex } from './mongo'
import client from './mongo-client'

describe('mongo.ts', () => {
    beforeAll(async () => {
        await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            try {
                await database.collection('test').drop()
            } catch {
                // ignore
            }
            try {
                await database.collection('options').drop()
            } catch {
                // ignore
            }
        })
    })

    afterAll(async () => {
        await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            try {
                await database.collection('test').drop()
            } catch {
                // ignore
            }
            try {
                await database.collection('options').drop()
            } catch {
                // ignore
            }
        })
    })

    test('insertOne() and findOne()', async () => {
        const inserted = await Mongo.insertOne('test', { mongo1: 1 })
        expect(inserted.acknowledged).toEqual(true)
        const _id = inserted.insertedId

        const find = await Mongo.findOne('test', { mongo1: 1 })
        expect(_id).toEqual(find!._id)
    })

    test('insertMany() and findMany()', async () => {
        await Mongo.insertMany('test', [
            { mongo2: 1, value: true },
            { mongo2: 2, value: false },
            { mongo2: 3, value: true },
        ])
        const find = await Mongo.findMany('test', { value: true })
        expect(find.map((v) => v.mongo2)).toEqual([1, 3])
        Mongo.deleteMany('test', {})
    })

    test('findOne() error', async () => {
        const find = await Mongo.findOne('test', { mongo3: 5 }).catch(
            () => 'error',
        )
        expect(find).toBe('error')
    })

    test('updateIndex()', async () => {
        await migrateIndex('0.0.1', {
            '0.0.1': {
                test: {
                    create: [[{ id: 1 }]],
                },
            },
        })

        const index = await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            return await database.collection('test').indexes()
        })

        expect(index[1].key).toStrictEqual({ id: 1 })

        await migrateIndex('0.0.2', {
            '0.0.2': {
                test: {
                    drop: [[{ id: 1 }]],
                },
            },
            '0.0.1': {
                test: {
                    create: [[{ id: 1 }]],
                },
            },
        })

        const index2 = await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            return await database.collection('test').indexes()
        })

        expect(index2.length).toBe(1)
    })
})
