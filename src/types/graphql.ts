export type GetPostsByArgs = {
    key: 'id' | 'slug' | 'category' | 'tag'
    value: string | number
    page?: number
}

export type GetTermByArgs = {
    key: 'id' | 'slug'
    value: string | number
}
