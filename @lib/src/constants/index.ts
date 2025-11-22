import { DAY_IN_SECONDS, MINUTE_IN_MS } from '@sujin/share/constants/datetime'

export * from './archive'
export * from './post'
export * from './image'
export * from './mongo'
export * from './menu'

export const PER_PAGE = 12
export const ACCESS_TOKEN_LIFETIME = 30 * MINUTE_IN_MS
export const REFRESH_TOKEN_LIFETIME = 30 * 30 * DAY_IN_SECONDS
