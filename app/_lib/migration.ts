/* Types */
import type { Migration } from '@common/data/mongo/mongo'
import type { PostType, TermType } from '@app/_lib/data/mysql/types'
/* Constants */
import { MONGO_DATABASE } from '@common/constants/helper'
import { COLLECTION } from '@app/_lib/data/types'
import SCHEMA from '@app/_lib/schema'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Utils */
import { updateBackgrounds } from '@app/_lib/data/mongo/wordpress/background'
import { updateCategory } from '@app/_lib/data/mongo/wordpress/category'
import { updateTag } from '@app/_lib/data/mongo/wordpress/tag'
import { updatePage } from '@app/_lib/data/mongo/wordpress/page'
import { updatePost } from '@app/_lib/data/mongo/wordpress/post'

const migration: Migration = {
    /**
     * Image type change
     */
    '10.2.6': async (client) => {
        const database = client.db(MONGO_DATABASE)

        // Background
        await database.command({
            collMod: COLLECTION.BACKGROUNDS,
            validator: {
                $jsonSchema: SCHEMA.backgrounds,
            },
        })
        await updateBackgrounds().catch(() => {})

        // Category
        await database.collection(COLLECTION.CATEGORY).dropIndex('hits_1')
        await database.command({
            collMod: COLLECTION.CATEGORY,
            validator: {
                $jsonSchema: SCHEMA.category,
            },
        })
        await Mongo.findMany<TermType>(COLLECTION.CATEGORY, {
            image: { $exists: true },
        }).then(async (result) => {
            for (let i = 0; i < result.length; i++) {
                await updateCategory(result[i].slug)
            }
        })

        // Tag
        await database.command({
            collMod: COLLECTION.TAG,
            validator: {
                $jsonSchema: SCHEMA.archives,
            },
        })
        await Mongo.findMany<TermType>(COLLECTION.TAG, {
            image: { $exists: true },
        }).then(async (result) => {
            for (let i = 0; i < result.length; i++) {
                await updateTag(result[i].slug)
            }
        })

        // Page
        await database.command({
            collMod: COLLECTION.PAGE,
            validator: {
                $jsonSchema: SCHEMA.posts,
            },
        })
        await Mongo.findMany<PostType>(COLLECTION.PAGE, {
            images: { $exists: true },
        }).then(async (result) => {
            for (let i = 0; i < result.length; i++) {
                await updatePage(result[i].slug)
            }
        })

        // Post
        await database.command({
            collMod: COLLECTION.POST,
            validator: {
                $jsonSchema: SCHEMA.posts,
            },
        })
        await Mongo.findMany<PostType>(COLLECTION.POST, {
            images: { $exists: true },
        }).then(async (result) => {
            for (let i = 0; i < result.length; i++) {
                await updatePost(result[i].slug)
            }
        })

        await Cached.getInstance().flush()
    },
    '10.2.5': async (client) => {
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
        await database
            .collection(COLLECTION.BACKGROUNDS)
            .createIndex('url', { unique: true })

        await database.createCollection(COLLECTION.CATEGORY, {
            validator: {
                $jsonSchema: SCHEMA.archives,
            },
        })
        await database
            .collection(COLLECTION.CATEGORY)
            .createIndex('slug', { unique: true })
        await database.collection(COLLECTION.CATEGORY).createIndex('total')
        await database.collection(COLLECTION.CATEGORY).createIndex('hits')

        await database.createCollection(COLLECTION.TAG, {
            validator: {
                $jsonSchema: SCHEMA.archives,
            },
        })
        await database
            .collection(COLLECTION.TAG)
            .createIndex('slug', { unique: true })
        await database.collection(COLLECTION.TAG).createIndex('total')
        await database.collection(COLLECTION.TAG).createIndex('hits')

        await database.createCollection(COLLECTION.OPTIONS, {
            validator: {
                $jsonSchema: SCHEMA.options,
            },
        })
        await database
            .collection(COLLECTION.OPTIONS)
            .createIndex('key', { unique: true })

        await database.createCollection(COLLECTION.PAGE, {
            validator: {
                $jsonSchema: SCHEMA.pages,
            },
        })
        await database
            .collection(COLLECTION.PAGE)
            .createIndex('slug', { unique: true })

        await database.createCollection(COLLECTION.POST, {
            validator: {
                $jsonSchema: SCHEMA.posts,
            },
        })
        await database
            .collection(COLLECTION.POST)
            .createIndex('slug', { unique: true })
        await database.collection(COLLECTION.POST).createIndex('date')
        await database
            .collection(COLLECTION.POST)
            .createIndex(['terms.slug', 'terms.type'])

        await database.createCollection(COLLECTION.SPECTRA)
        await database
            .collection(COLLECTION.SPECTRA)
            .createIndex(['number', 'ion'])

        await database.createCollection(COLLECTION.USERS)
        await database.collection(COLLECTION.USERS).createIndex(['email'])
    },
}

export default migration
