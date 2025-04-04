import { MONGO_DATABASE } from '@common/constants/helper'
import type { Migration } from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/_lib/data/mongo/constants'
import SCHEMA from '@app/_lib/schema'

const migration: Migration = {
    '10.2.4': async (client) => {
        const database = client.db(MONGO_DATABASE)
        // Drop all collections
        await database.collections().then(async (collections) => {
            for (let i = 0; i < collections.length; i++) {
                await collections[i].drop()
            }
        })

        await database.createCollection(COLLECTION.BACKGROUNDS, {
            validator: {
                $jsonSchema: SCHEMA.backgrounds,
            },
        })
        database
            .collection(COLLECTION.BACKGROUNDS)
            .createIndex('url', { unique: true })

        await database.createCollection(COLLECTION.CATEGORY, {
            validator: {
                $jsonSchema: SCHEMA.archives,
            },
        })
        database
            .collection(COLLECTION.CATEGORY)
            .createIndex('slug', { unique: true })
        database.collection(COLLECTION.CATEGORY).createIndex('total')
        database.collection(COLLECTION.CATEGORY).createIndex('hits')

        await database.createCollection(COLLECTION.TAG, {
            validator: {
                $jsonSchema: SCHEMA.archives,
            },
        })
        database
            .collection(COLLECTION.TAG)
            .createIndex('slug', { unique: true })
        database.collection(COLLECTION.TAG).createIndex('total')
        database.collection(COLLECTION.TAG).createIndex('hits')

        await database.createCollection(COLLECTION.OPTIONS, {
            validator: {
                $jsonSchema: SCHEMA.options,
            },
        })
        database
            .collection(COLLECTION.OPTIONS)
            .createIndex('key', { unique: true })

        await database.createCollection(COLLECTION.PAGE, {
            validator: {
                $jsonSchema: SCHEMA.pages,
            },
        })
        database
            .collection(COLLECTION.PAGE)
            .createIndex('slug', { unique: true })

        await database.createCollection(COLLECTION.POST, {
            validator: {
                $jsonSchema: SCHEMA.posts,
            },
        })
        database
            .collection(COLLECTION.POST)
            .createIndex('slug', { unique: true })
        database.collection(COLLECTION.POST).createIndex('date')
        database
            .collection(COLLECTION.POST)
            .createIndex(['terms.slug', 'terms.type'])

        await database.createCollection(COLLECTION.SPECTRA)
        database.collection(COLLECTION.SPECTRA).createIndex(['number', 'ion'])

        await database.createCollection(COLLECTION.USERS)
        database.collection(COLLECTION.USERS).createIndex(['email'])
    },
}

export default migration
