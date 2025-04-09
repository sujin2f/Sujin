// yarn test test-template.spec.ts

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () => Promise.resolve(null)),
}))

describe('test-template.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('test-function()', () => {
        test('test-function(): test case', async () => {
            expect(true).toBeTruthy()
        })
    })
})
