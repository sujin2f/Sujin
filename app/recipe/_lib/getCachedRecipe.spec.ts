// yarn test getCachedRecipe.spec.ts
import { VERSION } from '@common/constants/helper'
import migration from '@app/_lib/migration'
import { clearMongo } from '@common/.jest/helpers'
import { getCachedRecipe } from './getCachedRecipe'
import Cached from '@common/model/Cached'
import { COLLECTION } from '@app/_lib/types'
import { closeConnection, migrate } from '@common/data/mongo/mongo'
import { ObjectId } from 'mongodb'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))

describe('getCachedRecipe.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.POST, COLLECTION.ARCHIVE)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo(COLLECTION.POST, COLLECTION.ARCHIVE)
        await clearMongo()
        await closeConnection()
    })

    test('getCachedRecipe()', async () => {
        const recipe = await getCachedRecipe(new ObjectId()).catch(
            (e) => e.name,
        )
        expect(recipe).toEqual('204 No Content')
    })
})
