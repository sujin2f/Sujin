// yarn test string.spec.ts

import { toNumber, generateUUID } from './string'

describe('string.ts', () => {
    it('toNumber()', () => {
        expect(toNumber()).toEqual(0)
        expect(toNumber('0')).toEqual(0)
        expect(toNumber('$1,300')).toEqual(1300)
        expect(toNumber('$1,300.20')).toEqual(1300.2)
    })

    it('generateUUID()', () => {
        expect(generateUUID().length).toEqual(36)
        expect(generateUUID()).not.toEqual(generateUUID())
    })
})
