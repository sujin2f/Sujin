// yarn test getArchive.spec.ts

import { clearMongo } from '../../../../.jest/helpers'
import getArchive from './getArchive'
import Mongo from '@common/data/mongo/mongo'
import { TermTypes } from '@src/constants/wordpress'

describe('getArchive.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo('term')
    })

    afterAll(async () => {
        await clearMongo('term').then((client) => {
            client.close()
        })
    })

    test('getArchive.spec()', async () => {
        await Mongo.insertOne('term', {
            id: 1,
            title: 'Uncategorized',
            slug: 'blog',
            type: 'category',
            excerpt: '',
            image: null,
        })

        const result = await getArchive({
            type: TermTypes.category,
            slug: 'blog',
            page: 1,
        })
        expect(result.title).toEqual('Uncategorized')
    })
})
