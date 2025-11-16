export * from './archive'
export * from './post'
export * from './image'
export * from './mongo'
export * from './menu'

export const PER_PAGE = 12

export enum GQL_QUERY_TYPE {
    QUERY = 'query',
    UPDATE = 'update',
    REMOVE = 'remove',
}

export enum NUM_PAGES_CONTEXT {
    ARCHIVE_LIST = 'archive_list',
    POSTS_BY_CATEGORY = 'posts_by_category',
    PAGE_LIST = 'page_list',
}
