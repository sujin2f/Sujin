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
