export type GetPostsByKeys = 'id' | 'slug' | 'category' | 'tag'

export type GetTermByArgs = {
    key: 'id' | 'slug'
    value: string | number
}
