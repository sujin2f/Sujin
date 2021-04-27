/**
 * Environment settings helpers
 */

/**
 * Get if the current server is development server
 * @return {boolean}
 */
export const isDev = (): boolean => process.env.NODE_ENV === 'development'

/**
 * Get if the current server is running on Jest
 * @return {boolean}
 */
export const isJest = (): boolean =>
    process.env.NODE_ENV === 'test' && !!process.env.JEST_WORKER_ID
