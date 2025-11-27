import { createHash, generateKey, encodeText, decodeText } from './crypto'

describe('crypto.ts', () => {
    test('createHash()', () => {
        const hash = createHash('Sujin Choi', 'secret')
        expect(hash).toBe('da3624c4ed316b02791ef44edb1f19f6')
    })

    test('decodeText()', async () => {
        const key = await generateKey()
        const decoded = await encodeText('Sujin Choi', key)
        const result = await decodeText(decoded, key)
        expect(result).toBe('Sujin Choi')
        expect(decoded).not.toBe('Sujin Choi')
    })
})
