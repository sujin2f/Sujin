import { getRandomInt } from './number'
import { isEmpty } from './object'

/*
 * Deep copy
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

/*
 * Split array into many rows
 * i.g. splitItems(Array(10), 5) => [Array(5), Array(5)]
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

/*
 * Pick one item randomly
 */
export const random = <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)]
}

/*
 * Remove empty items from the end
 */
export const trimEnd = <T>(items: T[]): T[] => {
    let notEmpty = false
    const arr = deepCopy(items)
    return arr
        .reverse()
        .filter((item) => {
            // Once it's not empty, keep values
            if (notEmpty || (!isEmpty(item) && !notEmpty)) {
                notEmpty = true
            }
            return notEmpty
        })
        .reverse()
}

/*
 * Remove empty items
 */
export const filterEmpty = <T>(items: T[]): T[] => {
    return items.filter((item) => !isEmpty(item))
}

export const map = <T, U>(
    length: number,
    callback: (item: T, index: number) => U,
) => {
    return Array(length).fill('').map(callback)
}

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

export const shuffle = (input: any[]): any[] => {
    for (let i = input.length - 1; i > 0; i--) {
        const randomIndex = getRandomInt(i + 1)
        ;[input[i], input[randomIndex]] = [input[randomIndex], input[i]]
    }
    return input
}
