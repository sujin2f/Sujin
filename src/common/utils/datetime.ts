import { FullMonthNames, ShortMonthNames } from 'src/common/constants/datetime'

/*
 * Get YYYY-MM-DD format
 */
export const formatDate = (dateString: string | number | Date): string => {
    if (!dateString) {
        return ''
    }

    let date = dateString instanceof Date ? dateString : new Date(dateString)
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
 * Adding zero to a single string
 * 1 => 01
 * @param {string} amount
 * @param {number} digits How many digits it should be
 * @return {string}
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

export const getMonthName = (dt: Date, isFull = false) => {
    if (isFull) {
        return FullMonthNames[dt.getMonth()]
    }
    return ShortMonthNames[dt.getMonth()]
}
