// yarn test mongo.spec.ts

import { clearMongo } from '@jest/helpers'
import { migrate, closeConnection } from './mongo'

describe('mongo.ts', () => {
    beforeAll(async () => {
        await clearMongo('test', 'options')
    })

    afterAll(async () => {
        await clearMongo('test', 'options')
        await closeConnection()
    })

    test('migrate()', async () => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()
        const callback3 = jest.fn()
        const callback4 = jest.fn()
        const result = await migrate('0.1.0', '0.2.0', {
            '0.0.5': callback1,
            '0.1.5': callback2,
            '0.2.0': callback3,
            '0.2.5': callback4,
        })

        expect(callback1).not.toHaveBeenCalled()
        expect(callback2).toHaveBeenCalled()
        expect(callback3).toHaveBeenCalled()
        expect(callback4).not.toHaveBeenCalled()
        expect(result).toStrictEqual(['0.1.5', '0.2.0'])
    })
})
