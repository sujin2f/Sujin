// yarn test utils.spec.ts

import { auth } from '@app/_lib/utils-server'
import { POST_TYPE } from './types-post'

const mockSession = jest.fn()
jest.mock('next-auth', () => ({
    getServerSession: () => mockSession,
}))

jest.mock('./data/mysql/option', () => ({
    getOption: jest.fn(async () => true),
    removeOption: jest.fn(async () => true),
}))

describe('utils.ts & utils-server.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('auth()', () => {
        test('auth(): nonce pass', async () => {
            mockSession.mockResolvedValue(null)
            const result = await auth(POST_TYPE.POST, 'nonce').then(
                () => 'test pass',
            )
            expect(result).toBe('test pass')
        })

        test('auth(): nonce failed', async () => {
            mockSession.mockResolvedValue(null)
            const result = await auth(POST_TYPE.POST).catch(() => 'test pass')
            expect(result).toBe('test pass')
        })
    })
})
