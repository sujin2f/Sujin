import path from 'path'

// eslint-disable-next-line no-undef
export const root = process.cwd()
const baseDir = path.resolve(
    root,
    '.build',
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV || '',
)
export const outputPath = path.resolve(baseDir, 'frontend')
export const entryPath = {
    main: path.resolve(root, 'src/frontend/index.tsx'),
}
