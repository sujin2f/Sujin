/**
 * Compare two versions
 * @param {string} _current - The current version to compare.
 * @param {string} _old - The old version to compare against.
 * @returns {-1 | 0 | 1} -1: old is greater, 0: versions are equal, 1: current is greater
 */
export const compareVersions = (_current: string, _old: string): -1 | 0 | 1 => {
    const current = _current.split('.').map(Number)
    const old = _old.split('.').map(Number)
    const length = Math.max(current.length, old.length)

    for (let i = 0; i < length; i++) {
        if (!current[i] && old[i]) {
            return -1 // old is greater
        }
        if (current[i] && !old[i]) {
            return 1 // current is greater
        }
        if (current[i] > old[i]) {
            return 1 // current is greater
        }
        if (current[i] < old[i]) {
            return -1 // old is greater
        }
    }

    return 0 // versions are equal
}
