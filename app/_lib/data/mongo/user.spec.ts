// yarn test user.spec.ts

import { VERSION } from '@common/constants/helper'
import { clearMongo } from '@jest/helpers'
import { addUser, getUser } from './user'
import migration from '@app/_lib/migration'
import { COLLECTION } from '@app/_lib/types'
import Cached from '@common/model/Cached'
import { closeConnection, migrate } from '@common/data/mongo/mongo'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))

describe('user.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.USERS)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo()
        await closeConnection()
    })

    test('addUser()', async () => {
        await addUser(
            'sujin.2f@gmail.com',
            'Sujin',
            'http://test.com/image.jpg',
        )
        const user = await getUser('sujin.2f@gmail.com')
        expect(user?.name).toBe('Sujin')
    })
})
