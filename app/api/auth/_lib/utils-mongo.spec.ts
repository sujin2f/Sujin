// yarn test utils-mongo.spec.ts

import { VERSION } from '@common/constants/helper'
import { clearMongo } from '@common/.jest/helpers'
import { addUser, getUser } from './utils-mongo'
import migration from '@app/_lib/migration'
import { COLLECTION } from '@app/_lib/types'
import Cached from '@common/model/Cached'
import { migrate } from '@common/data/mongo/mongo'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))

describe('utils-mongo.spec.ts', () => {
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
