/**
 * Number to $
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
    const value = amount || 0
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency,
    })
}

/**
 * Roman Number
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

export const getRandomInt = (max: number, from?: number) => {
    if (!from) {
        return Math.floor(Math.random() * max)
    }

    const range = max - from
    return Math.floor(Math.random() * range) + from
}
