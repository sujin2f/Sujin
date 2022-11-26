// yarn test wordpress.spec.ts

import { unserialize } from './wordpress'

jest.mock('php-unserialize', () => ({
    unserialize: () => ({
        key: 'value',
    }),
}))

describe('wordpress.ts', () => {
    it('unserialize: Fail', () => {
        const result = unserialize('Thank you', 'You are welcome')
        expect(result).toBe('You are welcome')
    })

    it('unserialize: Key does not exist', () => {
        const result = unserialize('a}:', 'You are welcome', 'lock')
        expect(result).toBe('You are welcome')
    })
})
