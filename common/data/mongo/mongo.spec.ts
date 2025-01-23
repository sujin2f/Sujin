// yarn test mongo.spec.ts

import Mongo from './mongo'

describe('mongo.ts', () => {
    afterAll(async () => {
        Mongo.deleteMany('test', {})
    }, 10000)

    test('insertOne() and findOne()', async () => {
        const inserted = await Mongo.insertOne('test', { mongo1: 1 })
        expect(inserted.acknowledged).toEqual(true)
        const _id = inserted.insertedId

        const find = await Mongo.findOne('test', { mongo1: 1 })
        expect(_id).toEqual(find!._id)
    }, 10000)

    test('insertMany() and findMany()', async () => {
        await Mongo.insertMany('test', [
            { mongo2: 1, value: true },
            { mongo2: 2, value: false },
            { mongo2: 3, value: true },
        ])
        const find = await Mongo.findMany('test', { value: true })
        expect(find.map((v) => v.mongo2)).toEqual([1, 3])
        Mongo.deleteMany('test', {})
    }, 10000)

    test('findOne() error', async () => {
        const find = await Mongo.findOne('test', { mongo3: 5 }).catch(
            () => 'error',
        )
        expect(find).toBe('error')
    }, 10000)
})
