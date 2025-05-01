// yarn test crypto.spec.ts

import { decodeText, encodeText } from './crypto'

describe('crypto.ts', () => {
    test('encodeText() & decodeText()', async () => {
        const encoded = await encodeText('Sujin Choi')
        const decoded = await decodeText(encoded)
        expect(decoded).toBe('Sujin Choi')
    })
})
