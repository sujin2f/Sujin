// yarn test crawler.spec.ts

import { MongoMemoryServer } from 'mongodb-memory-server'
import actions from '../mongo/object-cache'

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
        await actions.insertOne({
            number: 1,
            ion: 1,
            result: false,
        })
        await actions.insertOne({
            number: 1,
            ion: 2,
            result: true,
        })

        const findX = await actions.findOne(1, 1)
        const findO = await actions.findOne(1, 2)

        expect(findX).toBeTruthy()
        expect(findO).toBeTruthy()
        // Expirations are different
        expect(findX!.expire).toBeLessThan(findO!.expire)
    })
})
