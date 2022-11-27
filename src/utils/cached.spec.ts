// yarn test node-cache.spec.ts

import { Cached } from './cached'

const get = jest.fn().mockImplementation()
const set = jest.fn().mockImplementation()
const del = jest.fn().mockImplementation()

jest.mock('node-cache', () => {
    return jest.fn().mockImplementation(() => {
        return {
            get,
            set,
            del,
        }
    })
})

describe('node-cache.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('set', async () => {
        Cached.getInstance().set('key', 'value')
        expect(set).toBeCalled()
    })

    it('get', async () => {
        const result = Cached.getInstance().get('key')
        expect(result).toBeFalsy()
        expect(get).not.toBeCalled()
    })

    it('getOrExecute', async () => {
        const execute = jest.fn()
        const result = Cached.getInstance().getOrExecute('key', execute)
        expect(execute).toBeCalled()
    })

    it('del', async () => {
        Cached.getInstance().del('key')
        expect(del).toBeCalled()
    })
})
