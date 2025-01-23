// yarn test spectra.spec.ts

import { MongoMemoryServer } from 'mongodb-memory-server'
import { getAtom } from '@src/utils/ether'
import { request } from './spectra'
import { NISTresponse } from '../../../../.jest/fixture'
import MongoClient from '@common/data/mongo/mongo-client'

describe('spectra.spec.ts', () => {
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

        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(NISTresponse),
            }),
        ) as jest.Mock
    })

    afterAll(async () => {
        if (mongoServer) {
            await MongoClient.close()
            await mongoServer.stop()
        }
    })

    it('request', async () => {
        const response = await request(getAtom(1), 1)
        expect(response.length).toBe(66)
    })
})
