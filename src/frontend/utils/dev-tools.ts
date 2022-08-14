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

export const sortText = (text: string, removeEmpty: boolean): string =>
    text
        .split('\n')
        .filter((l) => (removeEmpty && l) || !removeEmpty)
        .sort()
        .join('\n')

export const symbolAlignment = (text: string, symbol: string): string => {
    const lineInfo: {
        indent: number
        symbol: null | number
    }[] = []
    const maxPosition: number[] = [] // this key is indent

    return text
        .split('\n')
        .map((line, lineNumber) => {
            lineInfo[lineNumber] = {
                indent: 0,
                symbol: null,
            }

            let indentFound = false

            for (let i = 0; i < line.length; i += 1) {
                if (lineInfo[lineNumber].symbol === null) {
                    // Calculate indent
                    if (!indentFound) {
                        if (line[i] === ' ' || line[i] === '\t') {
                            lineInfo[lineNumber].indent += 1
                        } else {
                            indentFound = true
                        }
                    }

                    // Symbol finder
                    const compare = line.substring(i, i + symbol.length)
                    if (
                        compare === symbol &&
                        lineInfo[lineNumber].symbol === null
                    ) {
                        lineInfo[lineNumber].symbol = i
                        if (
                            (maxPosition[lineInfo[lineNumber].indent] || 0) < i
                        ) {
                            maxPosition[lineInfo[lineNumber].indent] = i
                        }
                    }
                }
            }

            return line
        })
        .map((line, lineNumber) => {
            // Change the text
            if (!lineInfo[lineNumber].symbol) {
                return line
            }

            const offset = lineInfo[lineNumber].symbol || 0
            const numSpaces = maxPosition[lineInfo[lineNumber].indent] - offset
            const spaces = Array(numSpaces).fill(' ').join('')
            const before = line.substring(0, offset)
            const after = line.substring(offset)
            return `${before}${spaces}${after}`
        })
        .join('\n')
}
