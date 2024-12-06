// yarn test number.spec.ts

import { formatCurrency, romanize } from './number'

describe('number.ts', () => {
    it('formatCurrency()', () => {
        expect(formatCurrency(0)).toEqual('$0.00')
        expect(formatCurrency(3600)).toEqual('$3,600.00')
        expect(formatCurrency(3600.3216)).toEqual('$3,600.32')
    })

    it('romanize()', () => {
        expect(romanize(1)).toEqual('I')
        expect(romanize(101)).toEqual('CI')
        expect(romanize(99)).toEqual('XCIX')
    })
})
