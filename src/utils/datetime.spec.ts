/**
 * Datetime test
 * @test yarn test --coverage=false ./src/utils/datetime.spec.ts
 */

import { DateTime } from 'src/utils/datetime'
import { DAY } from 'src/constants/datetime'

describe('Testing DateTime()', () => {
    test('Constructor: from string', () => {
        const sunday = new DateTime(new Date(Date.parse('1977-01-02 00:00:00')))
        const monday = new DateTime(new Date(Date.parse('1977-01-03 00:00:00')))

        expect('1977-01-02').toEqual(sunday.sunday)
        expect('1977-01-02 00:00:00').toEqual(sunday.toString())
        expect('Sun').toEqual(sunday.weekdayName)
        expect(0).toEqual(sunday.weekday)
        expect('1977-01-02').toEqual(monday.sunday)
        expect(31).toEqual(monday.daysInMonth())

        const fromString = new DateTime('1977-01-02 00:00:00')
        expect('1977-01-02').toEqual(fromString.sunday)
        expect('1977-01-02 00:00:00').toEqual(fromString.toString())
        expect('Sun').toEqual(fromString.weekdayName)
        expect(0).toEqual(fromString.weekday)
    })

    test('Constructor: from query string', () => {
        const fromQueryString = DateTime.fromQueryString({
            year: '1977',
            month: '1',
            date: '2',
            hour: '0',
            minute: '0',
            second: '0',
            weekday: '0',
            sunday: '1977-01-02',
            timestamp: '',
        })
        if (!fromQueryString) {
            expect(true).toEqual(false)
        }

        expect('1977-01-02').toEqual(fromQueryString?.sunday)
        expect('1977-01-02 00:00:00').toEqual(fromQueryString?.toString())
        expect('Sun').toEqual(fromQueryString?.weekdayName)
        expect(0).toEqual(fromQueryString?.weekday)
    })

    test('toMonthString()', () => {
        const datetime = new DateTime(new Date(2020, 5, 1))
        expect('2020-06').toEqual(datetime.toMonthString())
    })

    test('toDateParam()', () => {
        const datetime = new DateTime(new Date(2020, 5, 1))
        expect({
            year: 2020,
            month: 6,
            date: 1,
            hour: 0,
            minute: 0,
            second: 0,
            weekday: 1,
            sunday: '2020-05-31',
            timestamp: 1590984000000,
        }).toEqual(datetime.toDateParam())
    })

    test('toMidnight()', () => {
        const toMidnight = DateTime.toMidnight()
        expect(true).toEqual(toMidnight < DAY)
    })

    test('secondsToTimeString()', () => {
        expect(DateTime.timestampToTimeString(59000)).toEqual('00:00:59')
        expect(DateTime.timestampToTimeString(100000)).toEqual('00:01:40')
        expect(DateTime.timestampToTimeString(3600000)).toEqual('01:00:00')
        expect(DateTime.timestampToTimeString(3719000)).toEqual('01:01:59')
    })
})
