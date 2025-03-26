/**
 * DO NOT USE THIS FROM FRONTEND
 */
import path from 'path'
import fs from 'fs'
/* Utils */
import { isDev } from './system'

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
    const versionPath = (!isDev && process.env.VERSION) || ''
    return path.join(versionPath, filename)
}
