// yarn test mongo.spec.ts

import { clearMongo } from '@jest/helpers'
import Mongo from './mongo-deprecated'

describe('mongo.ts', () => {
    beforeAll(async () => {
        await clearMongo('test', 'options')
    })

    afterAll(async () => {
        await clearMongo('test', 'options').then(async (client) => {
            await client.close()
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
        const callback1 = jest.fn()
        const callback2 = jest.fn()
        const callback3 = jest.fn()
        const callback4 = jest.fn()
        const result = await Mongo.migrate('0.1.0', '0.2.0', {
            '0.0.5': callback1,
            '0.1.5': callback2,
            '0.2.0': callback3,
            '0.2.5': callback4,
        })

        expect(callback1).not.toHaveBeenCalled()
        expect(callback2).toHaveBeenCalled()
        expect(callback3).toHaveBeenCalled()
        expect(callback4).not.toHaveBeenCalled()
        expect(result).toStrictEqual(['0.1.5', '0.2.0'])
    })
})
