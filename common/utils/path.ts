/**
 * DO NOT USE THIS FROM FRONTEND
 *
 * @deprecated Deprecated in Next.js
 */

import path from 'path'
import fs from 'fs'
/* CONSTANTS */
import { IS_DEV, VERSION } from '@common/constants/helper'

export const rootDir = process.cwd()
export const publicDir = path.resolve(rootDir, 'public')
export const baseDir = path.resolve(
    rootDir,
    '.build',
    process.env.NODE_ENV || '',
)
export const bundles = () => {
    const manifest = path.resolve(baseDir, 'frontend', getPath('manifest.json'))
    const raw = fs.readFileSync(manifest).toString()
    return JSON.parse(raw)
}
export const getPath = (filename: string) => {
    const versionPath = (!IS_DEV && VERSION) || ''
    return path.join(versionPath, filename)
}
