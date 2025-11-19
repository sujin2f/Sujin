// yarn test object.spec.ts

import { filterEmpty, isEmpty, omit } from './object'

describe('object.ts', () => {
    it('filterEmpty()', () => {
        const testData = {
            a: 'a',
            b: '',
            c: 0,
            d: {},
            e: [[], []],
            f: undefined,
            g: null,
            h: NaN,
        }
        const result = filterEmpty(testData)
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

    it('omit(): null', () => {
        const input = {
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
            key4: 'value4',
        }
        const result = omit(input, 'key1', 'key2')
        expect(result).toStrictEqual({
            key3: 'value3',
            key4: 'value4',
        })
    })
})
