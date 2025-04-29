// yarn test spectra.spec.ts

import { clearMongo } from '@common/.jest/helpers'
import { NISTresponseH } from '@jest/fixture'
import { getSpectraFromNIST } from './spectra'
import { closeConnection } from '@common/data/mongo/mongo'

global.fetch = jest.fn(() =>
    Promise.resolve({
        text: () => Promise.resolve(NISTresponseH),
    }),
) as jest.Mock

describe('spectra.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo('spectra')
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo('spectra')
        await closeConnection()
    })

    test('request', async () => {
        const response = await getSpectraFromNIST(1, 1)
        expect(response.length).toBe(66)
    }, 10000)
})
