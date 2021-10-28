/**
 * Common helpers
 */

/**
 * Making a formatted string
 * Replace {n} to args
 *
 * @param {string} str
 * @param {string[]} args
 * @return {string}
 */
export const format = (str: string, ...args: (string | number)[]): string => {
    let result = str
    args.forEach((arg: string | number, idx: number) => {
        result = result.replace(new RegExp(`\\{${idx}\\}`, 'g'), arg.toString())
    })
    return result
}

/**
 * Adding zero to a single string
 * 1 => 01
 * @param {string} number
 * @return {string}
 */
const addZero = (number: string | number): string => {
    const num = typeof number === 'string' ? number : number.toString()

    if (num.length >= 2) {
        return num
    }

    return `0${num}`
}

export const dateToPrettyUrl = (timestamp: Date): string => {
    const date = new Date(timestamp)
    return `${date.getFullYear()}/${addZero(date.getMonth() + 1)}/${addZero(
        date.getDate(),
    )}`
}
