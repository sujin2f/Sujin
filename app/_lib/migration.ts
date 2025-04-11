/* Types */
import type { Migration } from '@common/data/mongo/mongo'
/* CONSTANTS */
import { IS_TEST, MONGO_DATABASE } from '@common/constants/helper'
import { COLLECTION } from '@app/_lib/types'
import { default as SCHEMA_10_2_6 } from '@app/_lib/data/mongo/schema/10.2.6'
import { default as SCHEMA_10_3_2 } from '@app/_lib/data/mongo/schema/10.3.2'
/* Models */
import Cached from '@common/model/Cached'
/* Utils */
import { updateBackgrounds } from '@app/_lib/data/mongo/wordpress/background'

const suffix = IS_TEST ? `-${process.env.JEST_WORKER_ID}` : ''

const migration: Migration = {
    '10.3.2': async (client) => {
        /**
         * Run this first
         * mongosh --authenticationDatabase admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD $MONGO_DATABASE --eval "db.updateUser('$MONGO_USER', {roles: [{role: 'dbAdmin', db: '$MONGO_DATABASE'}, {role: 'readWrite', db: '$MONGO_DATABASE'}]});"
         * Then, make user back to non-admin
         * mongosh --authenticationDatabase admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD $MONGO_DATABASE --eval "db.updateUser('$MONGO_USER', {roles: [{role: 'readWrite', db: '$MONGO_DATABASE'}]});"
         */
        const database = client.db(MONGO_DATABASE)
        database.command({
            collMod: `${COLLECTION.PAGE}${suffix}`,
            validator: {
                $jsonSchema: SCHEMA_10_3_2.page,
            },
        })
        database.command({
            collMod: `${COLLECTION.POST}${suffix}`,
            validator: {
                $jsonSchema: SCHEMA_10_3_2.post,
            },
        })
    },
    '10.3.0': async (client) => {
        const database = client.db(MONGO_DATABASE)
        // Add text index to post.content for search
        await database
            .collection(`${COLLECTION.POST}${suffix}`)
            .createIndex({ content: 'text' })
    },
    '10.2.6': async (client) => {
        const database = client.db(MONGO_DATABASE)

        // Background
        await (async () => {
            await database.createCollection(
                `${COLLECTION.BACKGROUNDS}${suffix}`,
                {
                    validator: {
                        $jsonSchema: SCHEMA_10_2_6.backgrounds,
                    },
                },
            )
            // Index
            await database
                .collection(`${COLLECTION.BACKGROUNDS}${suffix}`)
                .createIndex('url', { unique: true })
            await updateBackgrounds().catch(() => {})
        })().catch(() => {})
        // Category
        await (async () => {
            await database.createCollection(`${COLLECTION.CATEGORY}${suffix}`, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.category,
                },
            })
            // Index
            await database
                .collection(`${COLLECTION.CATEGORY}${suffix}`)
                .createIndex('slug', { unique: true })
            await database
                .collection(`${COLLECTION.CATEGORY}${suffix}`)
                .createIndex('total')
        })()
        // Tag
        await (async () => {
            await database.createCollection(`${COLLECTION.TAG}${suffix}`, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.tags,
                },
            })
            // Index
            await database
                .collection(`${COLLECTION.TAG}${suffix}`)
                .createIndex('slug', { unique: true })
            await database
                .collection(`${COLLECTION.TAG}${suffix}`)
                .createIndex('total')
            await database
                .collection(`${COLLECTION.TAG}${suffix}`)
                .createIndex('hits')
        })()
        // Options
        await (async () => {
            await database.createCollection(`${COLLECTION.OPTIONS}${suffix}`, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.options,
                },
            })
            // Index
            await database
                .collection(`${COLLECTION.OPTIONS}${suffix}`)
                .createIndex('key', { unique: true })
        })()
        // Page
        await (async () => {
            await database.createCollection(`${COLLECTION.PAGE}${suffix}`, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.pages,
                },
            })
            // Index
            await database
                .collection(`${COLLECTION.PAGE}${suffix}`)
                .createIndex('slug', { unique: true })
        })()
        // Post
        await (async () => {
            await database.createCollection(`${COLLECTION.POST}${suffix}`, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.posts,
                },
            })
            // Index
            await database
                .collection(`${COLLECTION.POST}${suffix}`)
                .createIndex('slug', { unique: true })
            await database
                .collection(`${COLLECTION.POST}${suffix}`)
                .createIndex('date')
            await database
                .collection(`${COLLECTION.POST}${suffix}`)
                .createIndex(['terms.slug', 'terms.type'])
        })()
        // Spectra
        await (async () => {
            await database.createCollection(`${COLLECTION.SPECTRA}${suffix}`)
            // Index
            await database
                .collection(`${COLLECTION.SPECTRA}${suffix}`)
                .createIndex(['number', 'ion'])
        })()
        // User
        await (async () => {
            await database.createCollection(`${COLLECTION.USERS}${suffix}`)
            // Index
            await database
                .collection(`${COLLECTION.USERS}${suffix}`)
                .createIndex(['email'])
        })()

        await Cached.getInstance().flush()
    },
}

export default migration
