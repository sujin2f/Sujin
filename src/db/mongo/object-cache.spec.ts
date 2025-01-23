// yarn test expiration.spec.ts

import { MongoMemoryServer } from 'mongodb-memory-server'
import actions from './object-cache'
import { ObjectId } from 'mongodb'

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
        await actions.insertOne('collection', 'key1', [new ObjectId()])

        const findX = await actions.findOne('collection', 'key2')
        const findO = await actions.findOne('collection', 'key1')

        expect(findX).toBeFalsy()
        expect(findO).toBeTruthy()
    })
})
