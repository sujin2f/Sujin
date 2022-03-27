// yarn test number.spec.ts

import { formatCurrency } from './number'

describe('number.ts', () => {
    it('formatCurrency()', () => {
        expect(formatCurrency(0)).toEqual('$0.00')
        expect(formatCurrency(3600)).toEqual('$3,600.00')
        expect(formatCurrency(3600.3216)).toEqual('$3,600.32')
    })
})
