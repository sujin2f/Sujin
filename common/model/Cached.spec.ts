/**
 * @jest-environment jsdom
 */
// yarn test Cached.spec.ts

import '@testing-library/jest-dom'
import { Cached } from './Cached'

describe('Cached.ts', () => {
    const cache = Cached.getInstance()
    test('set', async () => {
        await cache.set('html', '<body></body>')
        expect(await cache.get('html')).toBe('<body></body>')
    })

    test('getOrExecute', async () => {
        const text = await cache.getOrExecute('simple-text', async () => {
            return 'Simple Text'
        })
        expect(text).toBe('Simple Text')
    })

    test('flush', async () => {
        await cache.set('html', '<body></body>')
        await cache.set('simple-text', 'Simple Text')

        expect(await cache.get('html')).toBe('<body></body>')
        expect(await cache.get('simple-text')).toBe('Simple Text')

        await cache.del('html')
        await cache.del('simple-text')

        expect(await cache.get('html')).toBeFalsy()
        expect(await cache.get('simple-text')).toBeFalsy()
    })
})
