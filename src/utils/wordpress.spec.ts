// yarn test wordpress.spec.ts

import { unserialize } from './wordpress'

jest.mock('php-unserialize', () => ({
    unserialize: () => ({
        key: 'value',
    }),
}))

describe('wordpress.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('unserialize()', () => {
        it('Empty', () => {
            const result = unserialize('', 'You are welcome')
            expect(result).toBe('You are welcome')
        })

        it('Not Serialized Text', () => {
            const result = unserialize('Thank you', 'You are welcome')
            expect(result).toBe('Thank you')
        })

        it('Key does not exist', () => {
            const result = unserialize('a:{}', 'You are welcome', 'lock')
            expect(result).toBe('You are welcome')
        })
    })
})
