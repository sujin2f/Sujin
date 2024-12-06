/**
 * @jest-environment jsdom
 */
// yarn test Cached.spec.ts

import '@testing-library/jest-dom'
import { Cached } from './Cached'

describe('Cached.ts', () => {
    const cache = Cached.getInstance()
    it('set', () => {
        cache.set('html', '<body></body>')
        expect(cache.get('html')).toBe('<body></body>')
    })

    it('getOrExecute', async () => {
        const text = await cache.getOrExecute('simple-text', async () => {
            return 'Simple Text'
        })
        expect(text).toBe('Simple Text')
    })

    it('del', async () => {
        expect(cache.get('html')).toBe('<body></body>')
        expect(cache.get('simple-text')).toBe('Simple Text')

        cache.del('html')
        cache.del('simple-text')

        expect(cache.get('html')).toBeFalsy()
        expect(cache.get('simple-text')).toBeFalsy()
    })
})
