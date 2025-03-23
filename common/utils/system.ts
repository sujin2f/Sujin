export const isDev = process.env.NODE_ENV === 'development'

export const compareVersions = (_current: string, _old: string) => {
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
