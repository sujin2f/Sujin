/**
 * Common helpers
 */

export const getRatio = (basis: number | undefined, value: number): number => {
    return basis ? (value * 100) / basis : value * 100
}

export const getFixedLocalString = (
    value: number,
    decimalPoint = 2,
): string => {
    if (decimalPoint <= 0) {
        return value.toLocaleString()
    }

    const fixed = (Math.round(value * 100) / 100).toFixed(decimalPoint)
    const broken = fixed.split('.')
    return `${parseInt(broken[0]).toLocaleString()}.${broken[1]}`
}

export const hasOwnProperties = (
    object: Record<string, unknown>,
    ...props: string[]
): boolean => {
    if (!object) {
        return false
    }

    for (let i = 0; i < props.length; i++) {
        if (!object.hasOwnProperty(props[i])) {
            return false
        }
    }
    return true
}

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
