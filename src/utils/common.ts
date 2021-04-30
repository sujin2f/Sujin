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
