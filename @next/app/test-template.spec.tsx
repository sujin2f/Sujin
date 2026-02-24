// yarn test test-template.spec.ts

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
