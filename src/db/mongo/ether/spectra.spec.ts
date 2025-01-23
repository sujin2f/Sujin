// yarn test spectra.spec.ts

import { getAtom } from '@src/utils/ether'
import { NISTresponse } from '../../../../.jest/fixture'
import { request } from './spectra'
import Mongo from '@common/data/mongo/mongo'

describe('spectra.spec.ts', () => {
    beforeAll(async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(NISTresponse),
            }),
        ) as jest.Mock
    })

    afterAll(async () => {
        Mongo.deleteMany('test', {})
    })

    it('request', async () => {
        const response = await request(getAtom(1), 1)
        expect(response.length).toBe(66)
    })
})
