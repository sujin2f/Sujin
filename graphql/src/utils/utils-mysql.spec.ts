// // yarn test utils-mysql.spec.ts

// import { auth } from '@app/api/auth/_lib/utils-mysql'

// const userMock = jest.fn()
// jest.mock('next-auth', () => ({
//     getServerSession: jest.fn(async () => userMock),
// }))

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const query = jest.fn(async (_: string): Promise<unknown[]> => [['']])
// jest.mock('mysql2/promise', () => ({
//     createConnection: () => ({
//         query,
//     }),
// }))

// describe('utils-mysql.ts', () => {
//     afterAll(() => {
//         jest.clearAllMocks()
//     })

//     describe('auth()', () => {
//         test('auth(): nonce pass', async () => {
//             query.mockResolvedValue([
//                 [
//                     {
//                         option_value: 'test',
//                     },
//                 ],
//             ])
//             const result = await auth('nonce').then(() => 'test pass')
//             expect(result).toBe('test pass')
//         })

//         test('auth(): nonce failed', async () => {
//             query.mockResolvedValue([
//                 [
//                     {
//                         option_value: 'test',
//                     },
//                 ],
//             ])
//             const result = await auth().catch(() => 'test pass')
//             expect(result).toBe('test pass')
//         })
//     })
// })
