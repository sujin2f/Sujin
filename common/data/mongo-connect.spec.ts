// yarn test mongo-connect.spec.ts

import { MongoMemoryServer } from 'mongodb-memory-server'
import actions from './mongo-connect'

describe('mongo-connect.ts', () => {
    let mongoServer: MongoMemoryServer

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        global.process = {
            ...global.process,
            env: {
                ...global.process.env,
                MONGO: mongoServer.getUri().replace('mongodb://', ''),
            },
        }
    })

    afterAll(async () => {
        if (mongoServer) {
            await mongoServer.stop()
        }
    })

    it('insertOne() and findOne()', async () => {
        const inserted = await actions.insertOne('test', 'test', { test: 1 })
        expect(inserted.acknowledged).toEqual(true)
        const id = inserted.insertedId

        const find = await actions.findOne('test', 'test', { test: 1 })
        expect(id).toEqual(find._id)
    })

    it('insertMany() and findMany()', async () => {
        await actions.insertMany('test', 'test', [
            { test: 1, value: true },
            { test: 2, value: false },
            { test: 3, value: true },
        ])
        const find = await actions.findMany('test', 'test', { value: true })
        expect(find.map((v) => v.test)).toEqual([1, 3])
    })

    it('findOne() error', async () => {
        const find = await actions
            .findOne('test', 'test', { test: 5 })
            .catch(() => 'error')
        expect(find).toEqual('error')
    })
})
