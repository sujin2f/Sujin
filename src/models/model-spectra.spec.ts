// yarn test model-spectra.spec.ts

import { NISTresponseH } from '../../.jest/fixture'
import { getSpectraFromNIST } from '../db/mongo/ether/spectra'
import Mongo from '@common/data/mongo/mongo'
import { getSpectra } from '../utils/ether'

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
        const items = getSpectra(response)
        items['1-1'].sort()
        expect(items['1-1'].maxColumn).toBe(12)
    })
})
