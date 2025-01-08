import path from 'path'
import fs from 'fs'

export const rootDir = process.cwd()
export const publicDir = path.resolve(rootDir, 'public')
export const baseDir = path.resolve(
    rootDir,
    '.build',
    process.env.NODE_ENV || '',
)
export const bundles = () => {
    const manifest = path.resolve(baseDir, 'frontend', 'manifest.json')
    const raw = fs.readFileSync(manifest).toString()
    return JSON.parse(raw)
}

export const removeURLProtocol = (url: string) =>
    url.replace(/(^\w+:|^)\/\//, '')
