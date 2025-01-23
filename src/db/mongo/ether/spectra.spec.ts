// yarn test spectra.spec.ts

// import { MongoMemoryServer } from 'mongodb-memory-server'
import { getAtom } from '@src/utils/ether'
import { NISTresponse } from '../../../../.jest/fixture'
import { request } from './spectra'
import Mongo from '@common/data/mongo/mongo'

describe('spectra.spec.ts', () => {
    // // let mongoServer: MongoMemoryServer

    beforeAll(async () => {
        //     // jest.resetModules()
        //     // mongoServer = await MongoMemoryServer.create()
        //     // global.process.env.MONGO = mongoServer
        //     //     .getUri()
        //     //     .replace('mongodb://', '')
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(NISTresponse),
            }),
        ) as jest.Mock
        // Mongo.deleteMany('test', {})
    })

    afterAll(async () => {
        //     // const MongoClient =
        //     //     // eslint-disable-next-line @typescript-eslint/no-require-imports
        //     //     require('../../../../common/data/mongo/mongo-client').default
        //     // await MongoClient.close()
        //     // await mongoServer.stop()
        Mongo.deleteMany('test', {})
    })

    it('request', async () => {
        // // eslint-disable-next-line @typescript-eslint/no-require-imports
        // // const request = require('./spectra').request
        const response = await request(getAtom(1), 1)
        expect(response.length).toBe(66)
    })
})
