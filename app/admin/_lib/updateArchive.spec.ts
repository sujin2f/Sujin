// yarn test updateArchive.spec.ts

import MySQL from '@app/_lib/data/mysql'
import { VERSION } from '@common/constants/helper'
import { categoryFactory, tagFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import migration from '@app/_lib/migration'
import { ARCHIVE, COLLECTION, T_Archive } from '@app/_lib/types'
import Cached from '@common/model/Cached'
import {
    closeConnection,
    deleteOne,
    getCollection,
    migrate,
} from '@common/data/mongo/mongo'
import { updateArchive } from './updateArchive'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectOne = jest.fn(async (_: string): Promise<unknown> => '')
jest.spyOn(MySQL.prototype, 'selectOne').mockImplementation(selectOne)

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))

describe('updateArchive.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.ARCHIVE, COLLECTION.POST)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo()
        await closeConnection()
    })

    test('updateArchive(): tag, New', async () => {
        const slug = 'test-slug'
        const tag = await tagFactory({ slug, title: 'Changed' })
        await deleteOne(COLLECTION.ARCHIVE, { _id: tag._id })
        selectOne.mockResolvedValue(tag)

        await updateArchive(slug, ARCHIVE.TAG)
        const result = await (
            await getCollection<T_Archive>(COLLECTION.ARCHIVE)
        ).findOne({ slug })
        expect(result!.title).toBe('Changed')
    })

    test('updateArchive(): category, New', async () => {
        const slug = 'test-slug'
        const category = await categoryFactory({ slug, title: 'Changed' })
        await deleteOne(COLLECTION.ARCHIVE, { _id: category._id })
        selectOne.mockResolvedValue(category)

        await updateArchive(slug, ARCHIVE.CATEGORY)
        const result = await (
            await getCollection<T_Archive>(COLLECTION.ARCHIVE)
        ).findOne({ slug })
        expect(result!.title).toBe('Changed')
    })

    test('updateArchive(): tag, existing Mongo', async () => {
        const tag = await tagFactory()
        selectOne.mockResolvedValue({ ...tag, title: 'Changed' })

        await updateArchive(tag.slug, ARCHIVE.TAG)
        const result = await (
            await getCollection<T_Archive>(COLLECTION.ARCHIVE)
        ).findOne({ slug: tag.slug })
        expect(result!.title).toBe('Changed')
    })
})
