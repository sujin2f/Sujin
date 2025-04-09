/* Types */
import type { Migration } from '@common/data/mongo/mongo'
/* CONSTANTS */
import { MONGO_DATABASE } from '@common/constants/helper'
import { COLLECTION } from '@app/_lib/types'
import { default as SCHEMA_10_2_6 } from '@app/_lib/data/mongo/schema/10.2.6'
/* Models */
import Cached from '@common/model/Cached'
/* Utils */
import { updateBackgrounds } from '@app/_lib/data/mongo/wordpress/background'

const migration: Migration = {
    '10.3.0': async (client) => {
        const database = client.db(MONGO_DATABASE)
        // Add text index to post.content for search
        await database
            .collection(COLLECTION.POST)
            .createIndex({ content: 'text' })
    },
    '10.2.6': async (client) => {
        const database = client.db(MONGO_DATABASE)

        // Background
        await (async () => {
            await database.createCollection(COLLECTION.BACKGROUNDS, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.backgrounds,
                },
            })
            // Index
            await database
                .collection(COLLECTION.BACKGROUNDS)
                .createIndex('url', { unique: true })
            await updateBackgrounds().catch(() => {})
        })().catch(() => {})
        // Category
        await (async () => {
            await database.createCollection(COLLECTION.CATEGORY, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.category,
                },
            })
            // Index
            await database
                .collection(COLLECTION.CATEGORY)
                .createIndex('slug', { unique: true })
            await database.collection(COLLECTION.CATEGORY).createIndex('total')
        })()
        // Tag
        await (async () => {
            await database.createCollection(COLLECTION.TAG, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.tags,
                },
            })
            // Index
            await database
                .collection(COLLECTION.TAG)
                .createIndex('slug', { unique: true })
            await database.collection(COLLECTION.TAG).createIndex('total')
            await database.collection(COLLECTION.TAG).createIndex('hits')
        })()
        // Options
        await (async () => {
            await database.createCollection(COLLECTION.OPTIONS, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.options,
                },
            })
            // Index
            await database
                .collection(COLLECTION.OPTIONS)
                .createIndex('key', { unique: true })
        })()
        // Page
        await (async () => {
            await database.createCollection(COLLECTION.PAGE, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.pages,
                },
            })
            // Index
            await database
                .collection(COLLECTION.PAGE)
                .createIndex('slug', { unique: true })
        })()
        // Post
        await (async () => {
            await database.createCollection(COLLECTION.POST, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.posts,
                },
            })
            // Index
            await database
                .collection(COLLECTION.POST)
                .createIndex('slug', { unique: true })
            await database.collection(COLLECTION.POST).createIndex('date')
            await database
                .collection(COLLECTION.POST)
                .createIndex(['terms.slug', 'terms.type'])
        })()
        // Spectra
        await (async () => {
            await database.createCollection(COLLECTION.SPECTRA)
            // Index
            await database
                .collection(COLLECTION.SPECTRA)
                .createIndex(['number', 'ion'])
        })()
        // User
        await (async () => {
            await database.createCollection(COLLECTION.USERS)
            // Index
            await database.collection(COLLECTION.USERS).createIndex(['email'])
        })()

        await Cached.getInstance().flush()
    },
}

export default migration
