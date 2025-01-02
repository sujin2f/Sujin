const path = require('path')
const cwd = process.cwd()

/**
 * Create webpack aliases
 */
function createWebpackAliases(aliases) {
    const result = {}
    for (const name in aliases) {
        result[name] = path.join(cwd, aliases[name])
    }
    return result
}

// Export helpers
module.exports = {
    createWebpackAliases,
}
