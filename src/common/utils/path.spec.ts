// yarn test path.spec.ts

const { publicDir, baseDir, bundles } = require('./path')

jest.mock('fs', () => ({
    readFileSync: () =>
        JSON.stringify({ entrypoints: ['static/js/bundle.js'] }),
}))

describe('path.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('publicDir', () => {
        expect(publicDir.indexOf('public')).not.toBe(-1)
    })

    it('baseDir', () => {
        expect(baseDir.indexOf('.build')).not.toBe(-1)
    })

    it('bundles', () => {
        expect(bundles()).toEqual({ entrypoints: ['static/js/bundle.js'] })
    })
})
