// yarn test utils-mysql.spec.ts

import MySQL from '@app/_lib/data/mysql'
import { auth } from '@app/api/auth/_lib/utils-mysql'

const userMock = jest.fn()
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () => userMock),
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectOne = jest.fn(async (_: string): Promise<unknown> => '')
jest.spyOn(MySQL.prototype, 'selectOne').mockImplementation(selectOne)

describe('utils-mysql.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('auth()', () => {
        test('auth(): nonce pass', async () => {
            selectOne.mockResolvedValue({
                option_value: 'test',
            })
            const result = await auth('nonce').then(() => 'test pass')
            expect(result).toBe('test pass')
        })

        test('auth(): nonce failed', async () => {
            selectOne.mockResolvedValue({
                option_value: 'test',
            })
            const result = await auth().catch(() => 'test pass')
            expect(result).toBe('test pass')
        })
    })
})
