import { createHash } from './crypto'

describe('crypto.ts', () => {
    test('createHash()', () => {
        const hash = createHash('Sujin Choi', 'secret')
        expect(hash).toBe('da3624c4ed316b02791ef44edb1f19f6')
    })
})
