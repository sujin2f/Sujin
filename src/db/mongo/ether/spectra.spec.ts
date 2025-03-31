// yarn test spectra.spec.ts

import client from '@common/data/mongo/mongo-client'
import { NISTresponseH } from '../../../../.jest/fixture'
import { getSpectraFromNIST } from './spectra'

describe('spectra.spec.ts', () => {
    beforeAll(async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(NISTresponseH),
            }),
        ) as jest.Mock
    })

    afterAll(async () => {
        await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            try {
                await database.collection('spectra').drop()
            } catch {
                // ignore
            }
            client.close()
        })
    })

    test('request', async () => {
        const response = await getSpectraFromNIST(1, 1)
        expect(response.length).toBe(66)
    })
})
