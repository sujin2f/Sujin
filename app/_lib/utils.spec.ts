// yarn test utils.spec.ts

import { auth } from '@app/_lib/data/mongo/user'
import { encodeText, decodeText } from './utils-server'

const userMock = jest.fn()
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () => userMock),
}))

jest.mock('./data/mysql/option', () => ({
    getOption: jest.fn(async () => Promise.resolve(true)),
    removeOption: jest.fn(async () => Promise.resolve(true)),
}))

describe('utils.ts & utils-server.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('auth()', () => {
        test('auth(): nonce pass', async () => {
            userMock.mockReturnValueOnce(null)
            const result = await auth('nonce').then(() => 'test pass')
            expect(result).toBe('test pass')
        })

        test('auth(): nonce failed', async () => {
            console.log('auth(): nonce failed')
            userMock.mockReturnValueOnce(null)
            const result = await auth().catch((e) => {
                console.log(e)
                return 'test pass'
            })
            expect(result).toBe('test pass')
        })
    })

    test('encodeText() & decodeText()', async () => {
        const encoded = await encodeText('Sujin Choi')
        const decoded = await decodeText(encoded)
        expect(decoded).toBe('Sujin Choi')
    })
})
