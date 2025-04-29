import { IOError } from '../model/Error'
import { QuantumBool } from '../types'

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
 * Generates a UUID.
 *
 * @returns {string} The generated UUID.
 */
export const generateUUID = (): string => {
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

/**
 * Capitalizes the first letter of the input string.
 *
 * @param {string} input - The input string.
 * @returns {string} The capitalized string.
 */
export const capitalize = (input: string): string =>
    `${input.charAt(0).toUpperCase()}${input.slice(1)}`

/**
 * Joins multiple inputs into a single class name string.
 *
 * @param {...unknown[]} input - The input values.
 * @returns {string} The concatenated class name string.
 */
export const joinClassNames = (...input: unknown[]): string =>
    input
        .filter((s) => s)
        .map((s) => (s as string).toString().trim())
        .join(' ')

/**
 * Removes the protocol from a URL.
 *
 * @param {string} url - The input URL.
 * @returns {string} The URL without the protocol.
 */
export const removeURLProtocol = (url: string): string =>
    url.replace(/(^\w+:|^)\/\//, '//')

/**
 * Simple version of PHP un-serializer just for attachment meta values
 * Needs production testing before it's fully replaced
 * @todo for array
 */
export const phpUnSerialize = (input: string) => {
    const readBlock = (input: string) => {
        if (!input) {
            return false
        }
        if (input.startsWith('{}')) {
            return '{}'
        }
        if (input.startsWith('{')) {
            return '{'
        }
        if (input.startsWith('}')) {
            return '}'
        }
        if (input.startsWith('a:{')) {
            return 'a:{'
        }
        if (input.startsWith('a')) {
            return 'a'
        }

        const matched =
            input.match(/^s:[0-9]+:(.*?);/) || input.match(/^[ibd]:([0-9]+);/)
        if (!matched) {
            return false
        }
        return matched
    }

    // First, convert all between quotes
    const regexQuote = new RegExp(/"(.*?)"/g)
    const replaceQuote = '$%quote%$'
    const quotes = input.matchAll(regexQuote)
    let converted = input.trim().replaceAll(regexQuote, replaceQuote)
    let result = ''

    // Remove first array identifier
    converted = converted.replace(/^a:[0-9]+:/, '')

    let cursor: QuantumBool = QuantumBool.TRUE
    while (cursor !== QuantumBool.MOD) {
        const block = readBlock(converted)
        switch (block) {
            case '{}':
                result += ':{},'
                converted = converted.slice(2)
                cursor = QuantumBool.TRUE
                break
            case '{':
                result += ':{'
                converted = converted.slice(1)
                cursor = QuantumBool.TRUE
                break
            case '}':
                result = result.slice(0, -1)
                result += '},'
                converted = converted.slice(1)
                cursor = QuantumBool.TRUE
                break
            case 'a':
                const matchA = converted.match(/^a:[0-9]+:/)
                if (matchA) {
                    converted = converted.replace(matchA[0], '')
                }
                break
            case 'a:{':
                converted = converted.replace('a:', '')
                break
            default:
                if (Array.isArray(block)) {
                    converted = converted.replace(block[0], '')
                    if (cursor === QuantumBool.TRUE) {
                        result += block[1]
                        cursor = QuantumBool.FALSE
                    } else if (cursor === QuantumBool.FALSE) {
                        result += `:${block[1]},`
                        cursor = QuantumBool.TRUE
                    }
                } else {
                    cursor = QuantumBool.MOD
                }
        }
    }

    if (result.startsWith(':')) {
        result = result.slice(1)
    }
    if (result.endsWith(',')) {
        result = result.slice(0, -1)
    }

    // Convert %quote% back to string
    Array.from(quotes).forEach((quote) => {
        result = result.replace(replaceQuote, quote[0])
    })

    try {
        return JSON.parse(result)
    } catch {
        throw new IOError(result).setCause(phpUnSerialize)
    }
}
