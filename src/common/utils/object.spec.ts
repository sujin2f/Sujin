// yarn test object.spec.ts

import { removeEmpty, isEmpty } from './object'

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

    it('isEmpty(): string, empty', () => {
        const result = isEmpty('')
        expect(result).toBe(true)
    })

    it('isEmpty(): number, empty', () => {
        const result = isEmpty(NaN)
        expect(result).toBe(true)
    })

    it('isEmpty(): null', () => {
        const result = isEmpty(null)
        expect(result).toBe(true)
    })
})
