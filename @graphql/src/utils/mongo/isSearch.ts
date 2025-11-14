import sanitize from 'mongo-sanitize'

export const isSearch = (id: string): [string, number] => {
    const search = id.startsWith('search-')
    return [sanitize(search ? id.slice(7) : id), search ? 1 : 0]
}
