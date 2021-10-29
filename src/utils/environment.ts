/**
 * Environment settings helpers
 */

import path from 'path'
import fs from 'fs'

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

export const rootDir = path.resolve(__dirname, '../../')
export const publicDir = path.resolve(rootDir, 'public')
export const baseDirDev = path.resolve(rootDir, 'dist')
export const baseDirProd = path.resolve(rootDir, 'build', 'frontend')
export const bundles = (): string[] => {
    const dir = isDev()
        ? path.resolve(baseDirDev, 'static', 'js')
        : path.resolve(baseDirDev, 'static', 'js')
    return fs.readdirSync(dir).filter((file: string) => !file.endsWith('.map'))
}
