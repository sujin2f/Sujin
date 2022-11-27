// yarn test environment.spec.ts

import path from 'path'
import { rootDir, publicDir, baseDir, bundles } from './environment'

jest.mock('fs', () => ({
    readFileSync: () =>
        JSON.stringify({ entrypoints: ['static/js/bundle.js'] }),
}))

describe('environment.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('rootDir', () => {
        expect(rootDir).toBe(path.resolve(__dirname, '../../'))
    })

    it('publicDir', () => {
        expect(publicDir.indexOf('public')).not.toBe(-1)
    })

    it('baseDir', () => {
        expect(baseDir.indexOf('.build')).not.toBe(-1)
    })

    it('bundles', () => {
        expect(bundles()).toStrictEqual(['static/js/bundle.js'])
    })
})
