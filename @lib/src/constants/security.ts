import { DAY_IN_SECONDS, MINUTE_IN_SECONDS } from '@sujin/share/constants/datetime'

export const ACCESS_TOKEN_LIFETIME = 30 * MINUTE_IN_SECONDS
export const REFRESH_TOKEN_LIFETIME = 30 * 30 * DAY_IN_SECONDS

export const HEADER_TOKEN = 'authorization'
