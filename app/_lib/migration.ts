import type { WithId } from 'mongodb'
/* T_Types */
import type { T_Migration } from '@common/data/mongo/mongo'
/* CONSTANTS */
import { IS_TEST, MONGO_DATABASE } from '@common/constants/helper'
import { ARCHIVE, COLLECTION, T_Archive, T_Post } from '@app/_lib/types'
import { default as SCHEMA_10_2_6 } from '@app/_lib/data/mongo/schema/10.2.6'
import { default as SCHEMA_10_3_2 } from '@app/_lib/data/mongo/schema/10.3.2'
import { default as SCHEMA_10_3_3 } from '@app/_lib/data/mongo/schema/10.3.3'
/* Models */
import Cached from '@common/model/Cached'
/* Utils */
import { updateBackgrounds } from '@app/_lib/data/mongo/wordpress/background'

const suffix = IS_TEST ? `-${process.env.JEST_WORKER_ID}` : ''

const migration: T_Migration = {
    '10.3.3': async (client) => {
        /**
         * Archive collection
         * Run this first
         * mongosh --authenticationDatabase admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD $MONGO_DATABASE --eval "db.updateUser('$MONGO_USER', {roles: [{role: 'dbAdmin', db: '$MONGO_DATABASE'}, {role: 'readWrite', db: '$MONGO_DATABASE'}]});"
         * Then, make user back to non-admin
         * mongosh --authenticationDatabase admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD $MONGO_DATABASE --eval "db.updateUser('$MONGO_USER', {roles: [{role: 'readWrite', db: '$MONGO_DATABASE'}]});"
         */
        const database = client.db(MONGO_DATABASE)
        database.command({
            collMod: `${COLLECTION.POST}${suffix}`,
            validator: {
                $jsonSchema: SCHEMA_10_3_3.post,
            },
        })

        await database.createCollection(`${COLLECTION.ARCHIVE}${suffix}`, {
            validator: {
                $jsonSchema: SCHEMA_10_3_3.archive,
            },
        })
        // Index
        await database
            .collection(`${COLLECTION.ARCHIVE}${suffix}`)
            .createIndex(['slug', 'type'])

        // Insert tag to archive and hits
        await database
            .collection(`tag${suffix}`)
            .find({})
            .project({ _id: 0, id: 0 })
            .toArray()
            .then(async (tags) => {
                const archives = tags.map((tag) => {
                    return {
                        ...tag,
                        type: ARCHIVE.TAG,
                    }
                })
                if (archives.length) {
                    await database
                        .collection(`${COLLECTION.ARCHIVE}${suffix}`)
                        .insertMany(archives)
                }
            })

        // Insert category to archive
        await database
            .collection(`category${suffix}`)
            .find({})
            .project({ _id: 0, id: 0 })
            .toArray()
            .then(async (categories) => {
                const archives = categories.map((category) => ({
                    ...category,
                    type: ARCHIVE.CATEGORY,
                    hits: 0,
                }))
                if (archives.length) {
                    await database
                        .collection(`${COLLECTION.ARCHIVE}${suffix}`)
                        .insertMany(archives)
                }
            })

        // Post terms to archives
        await database
            .collection(`${COLLECTION.POST}${suffix}`)
            .aggregate([
                {
                    $lookup: {
                        from: `${COLLECTION.ARCHIVE}${suffix}`,
                        localField: 'terms.slug',
                        foreignField: 'slug',
                        as: 'archives',
                    },
                },
            ])
            .toArray()
            .then(async (posts) => {
                const inserts: T_Post[] = []
                posts.map(async (post) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { _id, terms, ...rest } = post
                    inserts.push({
                        ...rest,
                        archives: post.archives.map(
                            (archive: unknown) =>
                                (archive as WithId<T_Archive>)._id,
                        ),
                    } as T_Post)
                })

                await database
                    .collection(`${COLLECTION.POST}${suffix}`)
                    .deleteMany({})

                if (inserts.length) {
                    await database
                        .collection(`${COLLECTION.POST}${suffix}`)
                        .insertMany(inserts)
                }
            })

        // Drop databases
        await database.dropCollection('category').catch(() => true)
        await database.dropCollection('tag').catch(() => true)

        await Cached.getInstance().flush()
    },
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
            await database.createCollection(`category${suffix}`, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.category,
                },
            })
            // Index
            await database
                .collection(`category${suffix}`)
                .createIndex('slug', { unique: true })
            await database.collection(`category${suffix}`).createIndex('total')
        })()
        // Tag
        await (async () => {
            await database.createCollection(`tag${suffix}`, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.tags,
                },
            })
            // Index
            await database
                .collection(`tag${suffix}`)
                .createIndex('slug', { unique: true })
            await database.collection(`tag${suffix}`).createIndex('total')
            await database.collection(`tag${suffix}`).createIndex('hits')
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
