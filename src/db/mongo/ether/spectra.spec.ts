// yarn test spectra.spec.ts

import { clearMongo } from '../../../../.jest/helpers'
import { NISTresponseH } from '../../../../.jest/fixture'
import { getSpectraFromNIST } from './spectra'

describe('spectra.spec.ts', () => {
    beforeAll(async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(NISTresponseH),
            }),
        ) as jest.Mock
        await clearMongo('spectra')
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo('spectra').then(async (client) => {
            await client.close()
        })
    })

    test('request', async () => {
        const response = await getSpectraFromNIST(1, 1)
        expect(response.length).toBe(66)
    })
})
