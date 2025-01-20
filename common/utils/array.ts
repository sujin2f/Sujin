import { getRandomInt } from './number'
import { isEmpty } from './object'

/**
 * Copy array without any reference.
 *
 * @param {T[]} items - The array to copy.
 * @returns {T} The copied array.
 */
export const deepCopy = <T>(items: T[]): T[] => {
    return items.map((item: T) => {
        if (Array.isArray(item)) {
            return deepCopy(item)
        }

        if (typeof item === 'object') {
            return { ...item }
        }

        return item
    }) as T[]
}

/**
 * Split array into many rows.
 *
 * @example splitItems(Array(10), 5) => [Array(5), Array(5)]
 * @param {T[]} arr - The array to split.
 * @param {number} numOfRows - The number of rows to split the array into.
 * @returns {T[][]} The split array.
 */
export const splitItems = <T>(arr: T[], numOfRows: number): T[][] => {
    const result = new Array(numOfRows)
    arr.forEach((item, index) => {
        if (!result[index % numOfRows]) {
            result[index % numOfRows] = []
        }
        result[index % numOfRows].push(item)
    })
    return result
}

/**
 * Pick one item randomly from an array.
 *
 * @param {T[]} arr - The array to pick an item from.
 * @returns {T} The randomly picked item.
 */
export const random = <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Remove empty items from the end of an array.
 *
 * @param {T[]} items - The array to trim.
 * @returns {T[]} The trimmed array.
 */
export const trimEnd = <T>(items: T[]): T[] => {
    const arr = deepCopy(items)
    return trimStart(arr.reverse()).reverse()
}

/**
 * Remove empty items from the start of an array.
 *
 * @param {T[]} items - The array to trim.
 * @returns {T[]} The trimmed array.
 */
export function trimStart<T>(items: T[]): T[] {
    const arr = deepCopy(items)
    let i = 0
    for (; i < arr.length; i++) {
        if (arr[i]) {
            break
        }
    }
    return arr.splice(i)
}

/**
 * Remove empty items from an array.
 *
 * @param {T[]} items - The array to filter.
 * @returns {T[]} The filtered array.
 */
export const filterEmpty = <T>(items: T[]): T[] => {
    return items.filter((item) => !isEmpty(item))
}

/**
 * Create an array of a specified length and map each item using a callback function.
 *
 * @example map(Array(5), (item) => callback(item))
 * @param {number} length - The length of the array.
 * @param {(item: T, index: number) => U} callback - The callback function to map each item.
 * @returns {U[]} The mapped array.
 */
export const map = <T, U>(
    length: number,
    callback: (item: T, index: number) => U,
) => {
    return Array(length).fill('').map(callback)
}

/**
 * Calculate the sum of numeric items in an array.
 *
 * @param {unknown[]} items - The array of items.
 * @returns {number} The sum of the numeric items.
 */
export const sum = (items: unknown[]): number => {
    return items.reduce((a, b) => {
        if (
            !isEmpty(a) &&
            typeof a === 'number' &&
            !isNaN(a) &&
            !isEmpty(b) &&
            typeof b === 'number' &&
            !isNaN(b)
        ) {
            return a + b
        }
        return a
    }, 0) as number
}

/**
 * Calculate the average of numeric items in an array.
 *
 * @param {unknown[]} items - The array of items.
 * @returns {number} The average of the numeric items.
 */
export const average = (items: unknown[]): number => {
    let count = 1
    const sum = items.reduce((a, b) => {
        if (
            !isEmpty(a) &&
            typeof a === 'number' &&
            !isNaN(a) &&
            !isEmpty(b) &&
            typeof b === 'number' &&
            !isNaN(b)
        ) {
            count++
            return a + b
        }
        return a
    }, 0) as number
    return sum / count
}

/**
 * Shuffle the items in an array.
 *
 * @param {unknown[]} input - The array to shuffle.
 * @returns {unknown[]} The shuffled array.
 */
export const shuffle = (input: unknown[]): unknown[] => {
    for (let i = input.length - 1; i > 0; i--) {
        const randomIndex = getRandomInt(i + 1)
        ;[input[i], input[randomIndex]] = [input[randomIndex], input[i]]
    }
    return input
}

/**
 * Get the previous item in an array.
 *
 * @param {T[]} arr - The array of items.
 * @param {number} idx - The current index.
 * @returns {[number, T]} The previous index and item.
 */
export const getPrev = <T>(arr: T[], idx: number): [number, T] => {
    let prev = idx - 1
    prev = prev < 0 ? arr.length - 1 : prev
    return [prev, arr[prev]]
}

/**
 * Get the next item in an array.
 *
 * @param {T[]} arr - The array of items.
 * @param {number} idx - The current index.
 * @returns {[number, T]} The next index and item.
 */
export const getNext = <T>(arr: T[], idx: number): [number, T] => {
    let next = idx + 1
    next = next >= arr.length ? 0 : next
    return [next, arr[next]]
}
