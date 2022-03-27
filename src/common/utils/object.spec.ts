// yarn test object.spec.ts

import { removeEmpty } from './object'

describe('object.ts', () => {
    it('removeEmpty()', () => {
        const testData = {
            a: 'a',
            b: '',
            c: 0,
            d: {},
            e: [],
            f: undefined,
            g: null,
            h: NaN,
        }
        const result = removeEmpty(testData)
        expect(Object.keys(result).length).toEqual(1)
        expect(result.a).toEqual('a')
    })
})
