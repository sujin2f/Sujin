// yarn test array.spec.ts

import { deepCopy, splitItems } from './array'

describe('array.ts', () => {
    describe('deepCopy()', () => {
        it('🤬 Non-deep copy', () => {
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

        it('Deep copy', () => {
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

    it('splitItems()', () => {
        const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const result = splitItems(value, 3)
        expect(result).toEqual([
            [1, 4, 7, 10],
            [2, 5, 8],
            [3, 6, 9],
        ])
    })
})
