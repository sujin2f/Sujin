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
    categoryFormatter,
} from './archive'
import Mongo from '@common/data/mongo/mongo'
import migration from '@app/_lib/migration'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { ARCHIVE, COLLECTION, T_Category } from '@app/_lib/types'
import Cached from '@common/model/Cached'
import { category, tag } from '@jest/fixture'

jest.mock('../../../utils-server', () => ({
    isAdmin: jest.fn(() => true),
}))

const mockQuery = jest.fn()
jest.mock('../../mysql/term', () => ({
    getArchiveBySlug: () => mockQuery(),
}))

describe('archive.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await Mongo.migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.CATEGORY, COLLECTION.POST)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo().then(async (client) => {
            await client.close()
        })
    })

    test('getCachedArchive()', async () => {
        const category = await categoryFactory()
        await postFactory({
            terms: [
                {
                    id: 5818,
                    title: 'Blog',
                    slug: category.slug,
                    type: 'category',
                },
            ],
        })
        const result = await getCachedArchive(
            category.slug,
            ARCHIVE.CATEGORY,
            categoryFormatter,
        )
        expect(result.id).toEqual(category.id)
        expect(result.total).toEqual(1)
    })

    test('updateArchive(): tag, New', async () => {
        const slug = 'test-slug'

        mockQuery.mockImplementation(() =>
            Promise.resolve({ ...tag, slug, title: 'Changed' }),
        )

        await updateArchive(slug, ARCHIVE.TAG, (item) => item as T_Category)
        const result = await Mongo.findOne(ARCHIVE.TAG, {
            slug,
        })
        expect(result.title).toBe('Changed')
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

        await updateArchive(slug, ARCHIVE.CATEGORY, categoryFormatter)
        const result = await Mongo.findOne(ARCHIVE.CATEGORY, {
            slug,
        })
        expect(result.title).toBe('Changed')
    })

    test('updateArchive(): tag, existing Mongo', async () => {
        const { slug } = await tagFactory()

        mockQuery.mockImplementation(() =>
            Promise.resolve({ ...tag, slug, title: 'Changed' }),
        )

        await updateArchive(slug, ARCHIVE.TAG, (item) => item as T_Category)
        const result = await Mongo.findOne(ARCHIVE.TAG, {
            slug,
        })
        expect(result.title).toBe('Changed')
    })

    test('updateTerm(): only from MySQL', async () => {
        const category = await categoryFactory({ title: 'Changed' })
        await removeArchive(category.slug, ARCHIVE.CATEGORY)

        mockQuery.mockImplementation(() =>
            Promise.resolve({ ...category, title: 'Changed' }),
        )

        await updateArchive(category.slug, ARCHIVE.CATEGORY, categoryFormatter)
        const result = await Mongo.findOne(COLLECTION.CATEGORY, {
            id: category.id,
        })
        expect(result.title).toBe('Changed')
    })

    test('getTerms()', async () => {
        for (let i = 0; i < PER_PAGE + 1; i++) {
            await categoryFactory()
        }
        const result = await getArchives(2, ARCHIVE.CATEGORY, categoryFormatter)
        expect(result.length).toBe(1)
    })
})
