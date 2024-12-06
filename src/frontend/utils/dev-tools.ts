/*
 * Make first letter to upper case
 */
const ucfirst = (text: string): string =>
    `${text.charAt(0).toUpperCase()}${text.slice(1)}`

/*
 * String to array word by word
 */
export const preserveCase = (input: string): string[] => {
    let output = ''
    let lastChar = ''

    Array.from(Array(input.length).keys()).forEach((i) => {
        const c = input[i]

        if (/[a-z0-9]/.test(c)) {
            output += c.toLowerCase()
        } else if (/[A-Z]/.test(c)) {
            if (/[A-Z]/.test(lastChar)) {
                output += c.toLowerCase()
            } else {
                output += `-${c.toLowerCase()}`
            }
        } else {
            output += '-'
        }

        lastChar = c
    })

    return output.split('-').filter((c) => c)
}

/*
 * camelCase
 */
export const camelCase = (texts: string[]): string => {
    const output = texts.map((text) => ucfirst(text))
    output[0] = output[0].toLowerCase()
    return output.join('')
}

/*
 * CONSTANT_CASE
 */
export const constantCase = (texts: string[]): string =>
    texts.map((text) => text.toUpperCase()).join('_')

/*
 * dot.case
 */
export const dotCase = (texts: string[]): string =>
    texts.map((text) => text.toLowerCase()).join('.')

/*
 * param-case
 */
export const paramCase = (texts: string[]): string =>
    texts.map((text) => text.toLowerCase()).join('-')

/*
 * PascalCase
 */
export const pascalCase = (texts: string[]): string =>
    texts.map((text) => ucfirst(text)).join('')

/*
 * path/case
 */
export const pathCase = (texts: string[]): string =>
    texts.map((text) => text.toLowerCase()).join('/')

/*
 * snake_case
 */
export const snakeCase = (texts: string[]): string =>
    texts.map((text) => text.toLowerCase()).join('_')

/*
 * Title Case
 */
export const titleCase = (texts: string[]): string =>
    texts.map((text) => ucfirst(text)).join(' ')

const sortTextBlock = (text: string) =>
    text
        .split('\n')
        .filter((l) => l)
        .sort()
        .join('\n')

const sortTextWithPrimary = (text: string, primaryText: string) => {
    if (!primaryText) {
        return sortTextBlock(text)
    }

    const keys: string[] = []
    const empty: string[] = []
    const group: Record<string, string[]> = {}
    text.split('\n')
        .filter((l) => l)
        .forEach((line) => {
            const splitted = line.split(primaryText)
            const key = splitted[1]
            if (!key) {
                empty.push(line)
                return
            }

            if (!group[key]) {
                keys.push(key)
                group[key] = []
            }
            group[key].push(line)
        })

    const result = []
    if (empty.length) {
        result.push(sortTextBlock(empty.join('\n')))
    }
    keys.sort().forEach((key) => {
        result.push(sortTextBlock(group[key].join('\n')))
    })
    return result.join('\n')
}

export const sortText = (
    text: string,
    primaryText: string,
    groupByEmpty: boolean,
): string => {
    if (groupByEmpty) {
        return text
            .split('\n\n')
            .filter((l) => l)
            .map((block) => sortTextWithPrimary(block, primaryText))
            .join('\n\n')
    }
    return sortTextWithPrimary(text, primaryText)
}

export const getMaxCols = (text: string): number => {
    return Math.max(...text.split('\n').map((line) => line.length))
}

export const getRows = (text: string): number => {
    return text.split('\n').length
}
