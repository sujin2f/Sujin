export const currencyToNumber = (currency?: string): number => {
    if (!currency) {
        return 0
    }
    const float = parseFloat(currency.replace(/[^0-9.-]+/g, ''))
    if (!float || isNaN(float)) {
        return 0
    }
    return float
}

export const generateUUID = () => {
    let d = new Date().getTime()
    let d2: number

    try {
        d2 = performance && performance.now && performance.now() * 1000
    } catch (e) {
        d2 = 0
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16
        if (d > 0) {
            // tslint:disable-next-line: no-bitwise
            r = (d + r) % 16 | 0
            d = Math.floor(d / 16)
        } else {
            // tslint:disable-next-line: no-bitwise
            r = (d2 + r) % 16 | 0
            d2 = Math.floor(d2 / 16)
        }
        // tslint:disable-next-line: no-bitwise
        return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16)
    })
}

export const toMongoSearchString = (text: string) => {
    const title = text
        .replace(/[^a-zA-Z]/g, ' ')
        .toLowerCase()
        .split(' ')
        .filter((v) => v)
    const unique = [...new Set(title)]
    return unique.join(' ')
}
