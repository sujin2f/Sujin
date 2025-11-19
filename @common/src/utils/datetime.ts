import { FullMonthNames, ShortMonthNames } from '../constants/datetime'

/**
 * Formats a date as YYYY-MM-DD format.
 * @param {string | number | Date} dateString The date to format.
 * @returns {string} The formatted date string in YYYY-MM-DD format, or 'Invalid Date' if invalid.
 */
export const formatDate = (dateString: string | number | Date): string => {
    if (!dateString) {
        return ''
    }

    const date = dateString instanceof Date ? dateString : new Date(dateString)
    if (date.toString() === 'Invalid Date') {
        return 'Invalid Date'
    }

    date.setUTCHours(0, 0, 0, 0)

    const year = date.getUTCFullYear()
    const month = addZero(date.getUTCMonth() + 1)
    const day = addZero(date.getUTCDate())
    return `${year}-${month}-${day}`
}

/**
 * Adds leading zero(s) to a number or string.
 * @example addZero(1) => "01", addZero(1, 3) => "001"
 * @param {string | number} amount The number or string to pad.
 * @param {number} [digits=2] The target number of digits.
 * @returns {string} The padded string.
 */
export const addZero = (amount: string | number, digits = 2): string => {
    const num = typeof amount === 'string' ? amount : amount.toString()

    if (num.length >= digits) {
        return num
    }

    const value = new Array(digits - num.length).fill('0')
    value.push(num)

    return value.join('')
}

/**
 * Gets the month name for a given date.
 * @param {Date} dt The date object.
 * @param {boolean} [isFull=false] Whether to return the full month name or abbreviation.
 * @returns {string} The month name.
 */
export const getMonthName = (dt: Date, isFull = false) => {
    if (isFull) {
        return FullMonthNames[dt.getMonth()]
    }
    return ShortMonthNames[dt.getMonth()]
}
