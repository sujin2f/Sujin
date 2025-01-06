/**
 * String to number
 * i.g $1, 123, 00.23
 */
export const toNumber = (input?: string): number => {
    if (!input) {
        return 0
    }
    const float = parseFloat(input.replace(/[^0-9.-]+/g, ''))
    if (!float || isNaN(float)) {
        return 0
    }
    return float
}

/**
 * Get UUID
 */
export const generateUUID = () => {
    let d = new Date().getTime()
    let d2: number

    try {
        d2 = performance && performance.now && performance.now() * 1000
    } catch {
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

export const capitalize = (input: string) =>
    `${input.charAt(0).toUpperCase()}${input.slice(1)}`

export const className = (...input: unknown[]) =>
    input
        .filter((s) => s)
        .map((s) => (s as string).toString().trim())
        .join(' ')
