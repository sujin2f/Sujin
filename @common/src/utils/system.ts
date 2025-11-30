/**
 * Compares two semantic versions.
 * @param {string} _current The current version (e.g., '1.2.3').
 * @param {string} _comparison The comparison version (e.g., '1.2.4').
 * @returns {-1 | 0 | 1} -1 if comparison is greater, 0 if equal, 1 if current is greater.
 */
export const compareVersions = (_current: string, _comparison: string): -1 | 0 | 1 => {
    const current = _current.split('.').map(Number)
    const comparison = _comparison.split('.').map(Number)
    const length = Math.max(current.length, comparison.length)

    for (let i = 0; i < length; i++) {
        if (!current[i] && comparison[i]) {
            return -1 // comparison is greater
        }
        if (current[i] && !comparison[i]) {
            return 1 // current is greater
        }
        if (current[i] > comparison[i]) {
            return 1 // current is greater
        }
        if (current[i] < comparison[i]) {
            return -1 // comparison is greater
        }
    }

    return 0 // versions are equal
}
