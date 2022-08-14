// yarn test datetime.spec.ts

import { formatDate, yyyyMmDdToDate, addZero } from './datetime'

describe('datetime.ts', () => {
    it('formatDate()', () => {
        expect(formatDate('')).toEqual('')
        expect(formatDate(new Date('1977-01-02'))).toEqual('1977-01-02')
        expect(formatDate('1977-01-02')).toEqual('1977-01-02')
        expect(formatDate('1977/01/02')).toEqual('1977-01-02')
        expect(formatDate('01/02/1977')).toEqual('1977-01-02')
        expect(formatDate('30/30/1977')).toEqual('Invalid Date')
    })

    describe('yyyyMmDdToDate()', () => {
        it('Success', () => {
            const date = yyyyMmDdToDate('1977-01-02')
            expect(date.getUTCFullYear()).toEqual(1977)
            expect(date.getUTCMonth()).toEqual(0)
            expect(date.getUTCDate()).toEqual(2)
        })

        it('🤬 fail', () => {
            const today = new Date()
            const date = yyyyMmDdToDate('1977-01')

            expect(today.getFullYear()).toEqual(date.getFullYear())
            expect(today.getMonth()).toEqual(date.getMonth())
            expect(today.getUTCDate()).toEqual(date.getUTCDate())
        })
    })

    it('addZero()', () => {
        expect(addZero('1')).toEqual('01')
        expect(addZero(1)).toEqual('01')
        expect(addZero(10)).toEqual('10')
        expect(addZero(100)).toEqual('100')
    })
})
