import path from 'path'
// eslint-disable-next-line no-undef
const cwd = process.cwd()

/**
 * Create webpack aliases
 */
export const createWebpackAliases = (aliases) => {
    const result = {}
    for (const name in aliases) {
        result[name] = path.join(cwd, aliases[name])
    }
    return result
}
