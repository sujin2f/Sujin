// yarn test archive.spec.ts

import { VERSION } from '@common/constants/helper'
import {
    clearMongo,
    categoryFactory,
    tagFactory,
    postFactory,
} from '@jest/helpers'
import {
    getCachedArchive,
    updateArchive,
    removeArchive,
    getArchives,
} from './archive'
import migration from '@app/_lib/migration'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { ARCHIVE, COLLECTION, T_Archive } from '@app/_lib/types'
import Cached from '@common/model/Cached'
import { category, tag } from '@jest/fixture'
import {
    closeConnection,
    getCollection,
    migrate,
} from '@common/data/mongo/mongo'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))

const mockQuery = jest.fn()
jest.mock('../../mysql/term', () => ({
    getArchiveBySlug: () => mockQuery(),
}))

describe('archive.spec.ts', () => {
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

    test('getCachedArchive()', async () => {
        const category = await categoryFactory()
        await postFactory({
            archives: [category._id],
        })
        const archive = await getCachedArchive(category.slug, ARCHIVE.CATEGORY)
        expect(archive!._id).toEqual(category._id)
    })

    test('updateArchive(): tag, New', async () => {
        const slug = 'test-slug'

        mockQuery.mockImplementation(() =>
            Promise.resolve({ ...tag, slug, title: 'Changed' }),
        )

        await updateArchive(slug, ARCHIVE.TAG)
        const result = await (
            await getCollection<T_Archive>(COLLECTION.ARCHIVE)
        ).findOne({ slug })
        expect(result!.title).toBe('Changed')
    })

    test('updateArchive(): category, New', async () => {
        const slug = 'test-slug'

        mockQuery.mockImplementation(() =>
            Promise.resolve({
                ...category,
                slug,
                title: 'Changed',
            }),
        )

        await updateArchive(slug, ARCHIVE.CATEGORY)
        const result = await (
            await getCollection<T_Archive>(COLLECTION.ARCHIVE)
        ).findOne({ slug })
        expect(result!.title).toBe('Changed')
    })

    test('updateArchive(): tag, existing Mongo', async () => {
        const { slug } = await tagFactory()

        mockQuery.mockImplementation(() =>
            Promise.resolve({ ...tag, slug, title: 'Changed' }),
        )

        await updateArchive(slug, ARCHIVE.TAG)
        const result = await (
            await getCollection<T_Archive>(COLLECTION.ARCHIVE)
        ).findOne({ slug })
        expect(result!.title).toBe('Changed')
    })

    test('updateTerm(): only from MySQL', async () => {
        const category = await categoryFactory({ title: 'Changed' })
        await removeArchive(category.slug, ARCHIVE.CATEGORY)

        mockQuery.mockImplementation(() =>
            Promise.resolve({ ...category, title: 'Changed' }),
        )

        await updateArchive(category.slug, ARCHIVE.CATEGORY)
        const result = await (
            await getCollection<T_Archive>(COLLECTION.ARCHIVE)
        ).findOne({ slug: category.slug })
        expect(result!.title).toBe('Changed')
    })

    test('getTerms()', async () => {
        for (let i = 0; i < PER_PAGE + 1; i++) {
            await categoryFactory()
        }
        const result = await getArchives(ARCHIVE.CATEGORY, 2)
        expect(result.length).toBe(1)
    })
})
