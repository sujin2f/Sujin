// yarn test archive.spec.ts

import { VERSION } from '@common/constants/helper'
import {
    clearMongo,
    postFactory,
    categoryFactory,
} from '../../../../.jest/helpers'
import {
    getCachedArchive,
    updateArchiveTotal,
    updateArchive,
    removeArchive,
    getArchives,
} from './archive'
import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@src/constants/mongo'
import migration from '@src/constants/mongo/migration'
import setSystemOption from '@src/db/mongo/admin/setSystemOption'
import { PER_PAGE } from '@src/constants/mysql-query'
import { ARCHIVE } from '@src/types/wordpress'

const mockQuery = jest.fn()
jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))

describe('archive.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await Mongo.migrate('0.0.0', VERSION, migration)
        await setSystemOption('version', VERSION)
    })

    afterEach(async () => {
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
        const result = await getCachedArchive(
            category.slug,
            ARCHIVE.CATEGORY,
            true,
        )
        expect(result.id).toEqual(category.id)
    })

    // @todo
    test.skip('updateArchiveTotal()', async () => {
        const category = await categoryFactory()
        await postFactory({
            terms: [{ ...category, type: ARCHIVE.CATEGORY }],
        })
        await postFactory({
            terms: [{ ...category, type: ARCHIVE.CATEGORY }],
        })
        await postFactory({
            terms: [{ ...category, type: ARCHIVE.CATEGORY }],
        })
        const result = await updateArchiveTotal(category.slug, ARCHIVE.CATEGORY)
        expect(result.total).toEqual(3)
    })

    test('updateArchive(): existing Mongo', async () => {
        const category = await categoryFactory({ title: 'Changed' })

        mockQuery.mockImplementation((arg: string) => {
            if (
                arg.includes(
                    'ON taxonomy.term_taxonomy_id = relationships.term_taxonomy_id',
                )
            ) {
                return Promise.resolve([
                    {
                        ...category,
                        title: 'Changed',
                    },
                ])
            }
            return Promise.resolve([])
        })

        await updateArchive(category.slug, ARCHIVE.CATEGORY)
        const result = await Mongo.findOne(ARCHIVE.CATEGORY, {
            id: category.id,
        })
        expect(result.title).toBe('Changed')
    })

    test('updateTerm(): only from MySQL', async () => {
        const category = await categoryFactory({ title: 'Changed' })
        await removeArchive(category.slug, ARCHIVE.CATEGORY)

        mockQuery.mockImplementation((arg: string) => {
            if (
                arg.includes(
                    'ON taxonomy.term_taxonomy_id = relationships.term_taxonomy_id',
                )
            ) {
                return Promise.resolve([
                    {
                        ...category,
                        title: 'Changed',
                    },
                ])
            }
            return Promise.resolve([])
        })

        await updateArchive(category.slug, ARCHIVE.CATEGORY)
        const result = await Mongo.findOne(COLLECTION.CATEGORY, {
            id: category.id,
        })
        expect(result.title).toBe('Changed')
    })

    test('getTerms()', async () => {
        for (let i = 0; i < PER_PAGE + 1; i++) {
            await categoryFactory()
        }
        const result = await getArchives(2, ARCHIVE.CATEGORY)
        expect(result.length).toBe(1)
    })
})
