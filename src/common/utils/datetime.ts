export const formatDate = (dateString: string | number | Date): string => {
    if (!dateString) {
        return ''
    }

    const date = dateString instanceof Date ? dateString : new Date(dateString)
    if (date.toString() === 'Invalid Date') {
        return 'Invalid Date'
    }

    date.setUTCHours(0, 0, 0, 0)
    return `${date.getUTCFullYear()}-${addZero(
        date.getUTCMonth() + 1,
    )}-${addZero(date.getUTCDate())}`
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

/**
 * Convert YYYY-DD-MM to Date
 * @param {string} yyyyMmDd YYYY-DD-MM
 * @return {Date}
 */
export const yyyyMmDdToDate = (yyyyMmDd: string): Date => {
    const splitted = yyyyMmDd.split('-')
    const date = new Date()
    if (splitted.length !== 3) {
        date.setUTCHours(0, 0, 0, 0)
        return date
    }

    date.setUTCFullYear(parseInt(splitted[0]))
    date.setUTCMonth(parseInt(splitted[1]) - 1)
    date.setUTCDate(parseInt(splitted[2]))
    date.setUTCHours(0, 0, 0, 0)

    return date
}

export const getShortMonthName = (dt: Date) => {
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    return monthNames[dt.getMonth()]
}
