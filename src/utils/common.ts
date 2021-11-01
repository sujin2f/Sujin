/**
 * Common helpers
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { imageSizeMap, ImageType } from 'src/constants'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ImageSizes } from 'src/types'

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

export const dateToPrettyUrl = (date: Date): string => {
    return `${date.getFullYear()}/${addZero(date.getMonth() + 1)}/${addZero(
        date.getDate(),
    )}`
}

export const getImageMap = (type: ImageType, sizes: ImageSizes): ImageSizes => {
    return sizes
        .filter((size) => Object.keys(imageSizeMap[type]).includes(size.key))
        .map((size) => ({
            key: (imageSizeMap[type] as Record<string, string>)[size.key],
            file: size.file,
        }))
}
