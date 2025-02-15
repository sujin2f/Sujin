// yarn test spectra.spec.ts

import { NISTresponseH } from '../../../../.jest/fixture'
import { getSpectraFromNIST } from './spectra'
import Mongo from '@common/data/mongo/mongo'

describe('spectra.spec.ts', () => {
    beforeAll(async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(NISTresponseH),
            }),
        ) as jest.Mock
    })

    afterAll(async () => {
        Mongo.deleteMany('spectra', {})
    })

    test('request', async () => {
        const response = await getSpectraFromNIST(1, 1)
        expect(response.length).toBe(66)
    })
})
