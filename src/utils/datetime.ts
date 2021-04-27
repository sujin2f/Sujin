/**
 * Datetime class
 * @import { DateTime } from 'src/utils/datetime'
 */

import QueryString from 'qs'
import { DAY, SECOND, MINUTE, HOUR } from 'src/constants/datetime'
import { hasOwnProperties } from './common'

export type DateParam = {
    timestamp: number
    year: number
    month: number
    date: number
    hour: number
    minute: number
    second: number
    weekday: number
    sunday: string
}

interface Props {
    timestamp: number
    year: number
    month: number
    date: number
    hour: number
    minute: number
    second: number
    weekday: number
    sunday: string
}

type NullableDateTime = DateTime | undefined

type ConstructorTypes = Date | DateParam | number | string | undefined

export class DateTime {
    private props: Props = {
        timestamp: 0,
        year: 0,
        month: 0,
        date: 0,
        hour: 0,
        minute: 0,
        second: 0,
        weekday: 0,
        sunday: '',
    }
    static WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    public constructor(datetime: ConstructorTypes = undefined) {
        // Formatted string
        if (typeof datetime === 'string') {
            this.initString(datetime)
            return
        }

        // JS Date
        if (datetime instanceof Date) {
            this.initDate(datetime)
            return
        }

        // Timestamp
        if (typeof datetime === 'number') {
            this.initDate(new Date(datetime))
            return
        }

        // Empty (Now)
        if (datetime === undefined) {
            this.initDate(new Date())
            return
        }

        // from parameter
        this.initDateParam(datetime)
    }

    /**
     * Init object from string 0000-00-00 00:00:00
     * @param {string} datetime
     */
    private initString(formatted: string) {
        const splitted = formatted.split(' ')
        const date = splitted[0]
        const time = splitted[1] || ''
        const dates = date.split('-')
        const times = time.split(':')

        this.props.year = parseInt(dates[0])
        this.props.month = parseInt(dates[1])
        this.props.date = parseInt(dates[2])
        this.props.hour = parseInt(times[0]) || 0
        this.props.minute = parseInt(times[1]) || 0
        this.props.second = parseInt(times[2]) || 0

        const dateObject = new Date()
        dateObject.setDate(this.props.date)
        dateObject.setMonth(this.props.month - 1)
        dateObject.setFullYear(this.props.year)
        dateObject.setHours(this.props.hour)
        dateObject.setMinutes(this.props.minute)
        dateObject.setSeconds(this.props.second)

        this.props.weekday = dateObject.getDay()
        this.props.timestamp = dateObject.getTime()
    }

    /**
     * Init object from JS Date
     * @param {Date} datetime
     */
    private initDate(datetime: Date) {
        this.props.year = datetime.getFullYear()
        this.props.month = datetime.getMonth() + 1
        this.props.date = datetime.getDate()

        this.props.hour = datetime.getHours()
        this.props.minute = datetime.getMinutes()
        this.props.second = datetime.getSeconds()

        this.props.weekday = datetime.getDay()
        this.props.timestamp = datetime.getTime()
    }

    /**
     * Init object from DateParam
     * @param {DateParam} param
     */
    private initDateParam(param: DateParam) {
        this.props.year = param.year
        this.props.month = param.month
        this.props.date = param.date

        this.props.hour = param.hour
        this.props.minute = param.minute
        this.props.second = param.second

        this.props.weekday = param.weekday
        this.props.sunday = param.sunday
        this.props.timestamp = param.timestamp
    }

    /**
     * Create object from Node query string
     * @param {QueryString.ParsedQs} query
     * @return {NullableDateTime}
     */
    public static fromQueryString = (
        query: QueryString.ParsedQs,
    ): NullableDateTime => {
        if (
            !hasOwnProperties(
                query,
                'year',
                'month',
                'date',
                'hour',
                'minute',
                'second',
                'weekday',
                'sunday',
                'timestamp',
            )
        ) {
            return
        }

        const dateParam = {
            year: parseInt(query.year as string),
            month: parseInt(query.month as string),
            date: parseInt(query.date as string),
            hour: parseInt(query.hour as string),
            minute: parseInt(query.minute as string),
            second: parseInt(query.second as string),
            weekday: parseInt(query.weekday as string),
            sunday: query.sunday as string,
            timestamp: parseInt(query.timestamp as string),
            count: 0,
        }

        return new DateTime(dateParam)
    }

    public toQueryString(): string {
        return Object.keys(this.props)
            .map(
                (key: string) =>
                    `${key}=${
                        ((this.props as unknown) as Record<string, unknown>)[
                            key
                        ]
                    }`,
            )
            .join('&')
    }

    /**
     * @return {number} year
     */
    get year(): number {
        return this.props.year
    }

    /**
     * @return {number} month
     */
    get month(): number {
        return this.props.month
    }

    /**
     * @return {number} date
     */
    get date(): number {
        return this.props.date
    }

    /**
     * @return {number} hour
     */
    get hour(): number {
        return this.props.hour
    }

    /**
     * @return {number} minute
     */
    get minute(): number {
        return this.props.minute
    }

    /**
     * @return {number} second
     */
    get second(): number {
        return this.props.second
    }

    /**
     * @return {number} weekday
     */
    get weekday(): number {
        return this.props.weekday
    }

    /**
     * @return {string} weekday name (Sun, Mon, ...)
     */
    get weekdayName(): string {
        return DateTime.WEEKDAYS[this.props.weekday]
    }

    /**
     * @return {string} sunday
     */
    get sunday(): string {
        return this.props.sunday || this.getSunday()
    }

    /**
     * @return {number} timestamp
     */
    get timestamp(): number {
        return this.props.timestamp
    }

    /**
     * To formatted string
     * @return {string} YYYY-MM-DD hh:mm:ss
     */
    public toString(): string {
        return `${this.toDateString()} ${this.toTimeString()}`
    }

    /**
     * To formatted date string
     * @return {string} YYYY-MM-DD
     */
    public toDateString(): string {
        const month = DateTime.addZero(this.month)
        const date = DateTime.addZero(this.date)
        return `${this.year}-${month}-${date}`
    }

    /**
     * To formatted month string
     * @return {string} YYYY-MM
     */
    public toMonthString(): string {
        const month = DateTime.addZero(this.month)
        return `${this.year}-${month}`
    }

    /**
     * To formatted time string
     * @return {string} hh:mm:ss
     */
    public toTimeString(): string {
        const hour = DateTime.addZero(this.hour)
        const minute = DateTime.addZero(this.minute)
        const second = DateTime.addZero(this.second)
        return `${hour}:${minute}:${second}`
    }

    /**
     * To Axios parameter
     * @return {string} hh:mm:ss
     */
    public toDateParam(): DateParam {
        return {
            year: this.year,
            month: this.month,
            date: this.date,
            hour: this.hour,
            minute: this.minute,
            second: this.second,
            weekday: this.weekday,
            sunday: this.sunday,
            timestamp: this.timestamp,
        }
    }

    /**
     * Get Sunday of the week
     * @return {string} Sunday of the week
     */
    private getSunday(): string {
        const date = new Date(this.timestamp)
        const weekday = date.getDay()
        const sunday = date.getTime() - weekday * DAY
        const format = new DateTime(sunday)
        return format.toDateString()
    }

    /**
     * Get how many days in the month
     * @return {number} Number of days
     */
    public daysInMonth(): number {
        return new Date(this.year, this.month, 0).getDate()
    }

    /**
     * Adding zero to a single string
     * 1 => 01
     * @param {string} number
     * @return {string}
     */
    public static addZero(number: string | number): string {
        const num = typeof number === 'string' ? number : number.toString()

        if (num.length >= 2) {
            return num
        }

        return `0${num}`
    }

    /**
     * Convert timestamp to 00:00:00 format
     * @param {number} timestamp
     * @return {string}
     */
    public static timestampToTimeString = (timestamp: number): string => {
        const hour = Math.floor(timestamp / HOUR)
        const minute = Math.floor((timestamp % HOUR) / MINUTE)
        const second = Math.floor((timestamp % MINUTE) / SECOND)

        return `${DateTime.addZero(hour)}:${DateTime.addZero(
            minute,
        )}:${DateTime.addZero(second)}`
    }

    /**
     * Get today's midnight
     * @return {number} miliseconds
     */
    public static toMidnight(): number {
        const now = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0)
        tomorrow.setMinutes(0)
        tomorrow.setSeconds(1)
        return tomorrow.getTime() - now.getTime()
    }
}
