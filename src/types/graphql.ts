export type GetPostsByArgs = {
    key: 'id' | 'slug' | 'category' | 'tag'
    value: string
    page?: number
}

export type GetTermByArgs = {
    key: 'id' | 'slug'
    value: string | number
}
