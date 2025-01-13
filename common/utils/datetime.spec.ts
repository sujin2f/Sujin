// yarn test datetime.spec.ts

import { formatDate, addZero, getMonthName } from './datetime'

describe('datetime.ts', () => {
    it('formatDate()', () => {
        expect(formatDate('')).toEqual('')
        expect(formatDate(new Date('1977-01-02'))).toEqual('1977-01-02')
        expect(formatDate('1977-01-02')).toEqual('1977-01-02')
        expect(formatDate('1977/01/02')).toEqual('1977-01-02')
        expect(formatDate('01/02/1977')).toEqual('1977-01-02')
        expect(formatDate('30/30/1977')).toEqual('Invalid Date')
    })

    it('addZero()', () => {
        expect(addZero('1')).toEqual('01')
        expect(addZero(1)).toEqual('01')
        expect(addZero(10)).toEqual('10')
        expect(addZero(100)).toEqual('100')
    })

    it('getMonthName()', () => {
        expect(getMonthName(new Date('1977-01-02'))).toEqual('Jan')
        expect(getMonthName(new Date('1977-01-02'), true)).toEqual('January')
    })
})
