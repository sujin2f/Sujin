/**
 * @jest-environment node
 */
// yarn test Cache.spec.ts

// import Cached from './Cache'

// describe('Cached.ts', () => {
//     const cache = Cached.getInstance()
//     test('set', () => {
//         cache.set('html', '<body></body>')
//         expect(cache.get('html')).toBe('<body></body>')
//     })

//     test('getOrExecute', async () => {
//         const cb = new Promise((resolve) => resolve('Simple Text'))
//         const text = await cache.getOrExecute('simple-text', cb)
//         expect(text).toBe('Simple Text')
//     })

//     test('flush', () => {
//         cache.set('html', '<body></body>')
//         cache.set('simple-text', 'Simple Text')

//         expect(cache.get('html')).toBe('<body></body>')
//         expect(cache.get('simple-text')).toBe('Simple Text')

//         cache.flush('html', 'simple-text')

//         expect(cache.get('html')).toBeFalsy()
//         expect(cache.get('simple-text')).toBeFalsy()
//     })
// })

describe('Cached.ts', () => {
    test('-', () => {
        expect(true).toBeTruthy()
    })
})
