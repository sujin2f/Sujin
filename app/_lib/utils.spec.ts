// yarn test utils.spec.ts

import { auth } from '@app/_lib/utils-server'
import { POST_TYPE } from './types'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () => Promise.resolve(null)),
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
            const result = await auth(POST_TYPE.POST, 'nonce').then(
                () => 'test pass',
            )
            expect(result).toBe('test pass')
        })

        test('auth(): nonce failed', async () => {
            const result = await auth(POST_TYPE.POST).catch(() => 'test pass')
            expect(result).toBe('test pass')
        })
    })
})
