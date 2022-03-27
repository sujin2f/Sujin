// yarn test enum.spec.ts

import { hasEnumValue, hasEnumKey, getEnumKeys, getEnumValues } from './enum'

describe('enum.ts', () => {
    enum Test {
        a = '1',
        b = '2',
        c = '3',
    }
    enum Test2 {
        TRUE,
        FALSE,
    }

    it('getEnumKeys()', () => {
        expect(getEnumKeys(Test)).toEqual(['a', 'b', 'c'])
        expect(getEnumKeys(Test2)).toEqual(['TRUE', 'FALSE'])
    })

    it('getEnumValues()', () => {
        expect(getEnumValues(Test)).toEqual(['1', '2', '3'])
        expect(getEnumValues(Test2)).toEqual([0, 1])
    })

    it('hasEnumValue()', () => {
        expect(hasEnumValue(Test, '1')).toBeTruthy()
        expect(hasEnumValue(Test, '4')).toBeFalsy()
        expect(hasEnumValue(Test2, 1)).toBeTruthy()
        expect(hasEnumValue(Test2, 4)).toBeFalsy()
    })

    it('hasEnumKey()', () => {
        expect(hasEnumKey(Test, 'a')).toBeTruthy()
        expect(hasEnumKey(Test, 'd')).toBeFalsy()
        expect(hasEnumKey(Test2, 'TRUE')).toBeTruthy()
        expect(hasEnumKey(Test2, 'DONT_KNOW')).toBeFalsy()
    })
})
