import { addZero } from 'src/common/utils/datetime'
import { imageSizeMap, ImageType } from 'src/constants/wp'
import { ImageSizes } from 'src/types/wordpress'

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
