// yarn test getArchive.spec.ts

import client from '@common/data/mongo/mongo-client'
import getArchive from './getArchive'
import Mongo from '@common/data/mongo/mongo'
import { TermTypes } from '@src/constants/wordpress'

describe('getArchive.spec.ts', () => {
    afterAll(async () => {})

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

        await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            try {
                await database.collection('term').drop()
            } catch {}

            await client.close()
        })
    })
})
