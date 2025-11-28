/**
 * Formats a number as a currency string.
 * @param {number} amount The amount to format.
 * @param {string} [currency='USD'] The currency code (e.g., 'USD', 'EUR').
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
    const value = amount || 0
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency,
    })
}

/**
 * Converts an Arabic number to Roman numeral notation.
 * @param {number} arabic The Arabic number to convert.
 * @returns {string} The Roman numeral representation.
 */
export const romanize = (arabic: number) => {
    const lookup = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
    }
    let roman = ''

    type LookUp = keyof typeof lookup
    ;(Object.keys(lookup) as LookUp[]).forEach((key) => {
        while (arabic >= lookup[key]) {
            roman += key
            arabic -= lookup[key]
        }
    })
    return roman
}

/**
 * Generates a random integer.
 * @param {number} max The maximum value (exclusive).
 * @param {number} [from] If provided, generates a random integer between from and max.
 * @returns {number} The random integer.
 */
export const getRandomInt = (max: number, from?: number) => {
    if (!from) {
        return Math.floor(Math.random() * max)
    }

    const range = max - from
    return Math.floor(Math.random() * range) + from
}

/**
 * Converts a hexadecimal color code to RGB values.
 * @param {string} hex The hexadecimal color code (e.g., '#FF5733' or 'FF5733').
 * @returns {number[]} Array of [red, green, blue] values (0-255).
 */
export const hexToRgb = (hex: string) => {
    const color = parseInt(hex, 16)
    // Hex is 2^4 / two digits hex is 2^8 / moving 16 bits to the right => red
    const red = (color >> 16) & 0xff
    const green = (color >> 8) & 0xff
    const blue = color & 0xff

    return [red, green, blue]
}

/**
 * Returns ratio of num2 when num1 is 1 - like with & height
 * @param {number} num1
 * @param {number} num2
 * @returns {number}
 */
export const getRatio = (num1: number, num2: number): number => num2 / num1
