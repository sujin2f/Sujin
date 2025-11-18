// yarn test array.spec.ts

import {
    deepCopy,
    splitItems,
    random,
    trimEnd,
    filterEmpty,
    transpose,
} from './array'

describe('array.ts', () => {
    describe('deepCopy()', () => {
        test('🤬 Non-deep copy', () => {
            const value = [
                [
                    {
                        _id: 'test_id_1',
                    },
                    {
                        _id: 'test_id_2',
                    },
                ],
            ]
            const copied = { ...value }
            value[0][0]._id = 'test_id_3'

            expect(copied[0][0]._id).not.toEqual('test_id_1')
        })

        test('Deep copy', () => {
            const value = [
                [
                    {
                        _id: 'test_id_1',
                    },
                    {
                        _id: 'test_id_2',
                    },
                ],
            ]
            const copied = deepCopy(value)
            value[0][0]._id = 'test_id_3'

            expect(copied[0][0]._id).toEqual('test_id_1')
            expect(deepCopy([1, 2, 3])).toEqual([1, 2, 3])
        })
    })

    test('splitItems()', () => {
        const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const result = splitItems(value, 3)
        expect(result).toEqual([
            [1, 4, 7, 10],
            [2, 5, 8],
            [3, 6, 9],
        ])
    })

    test('random()', () => {
        const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const result = random(value)
        expect(value.indexOf(result) >= -1).toBeTruthy()
    })

    test('trimEnd()', () => {
        const value = [
            1,
            2,
            NaN,
            4,
            undefined,
            6,
            '',
            8,
            9,
            10,
            NaN,
            undefined,
            '',
        ]
        const result = trimEnd(value)
        expect(result).toEqual(value.slice(0, 10))
    })

    test('filterEmpty()', () => {
        const value = [
            1,
            2,
            NaN,
            4,
            undefined,
            6,
            '',
            8,
            9,
            10,
            NaN,
            undefined,
            '',
        ]
        const result = filterEmpty(value)
        expect(result).toEqual([1, 2, 4, 6, 8, 9, 10])
    })

    test('transpose()', () => {
        const arr = [
            [1, 2, 3],
            [4, 5],
            [6, 7, 8],
        ]
        const result = transpose(arr)
        expect(result).toEqual([
            [1, 4, 6],
            [2, 5, 7],
            [3, undefined, 8],
        ])
    })
})
