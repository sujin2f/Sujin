import type { WithId } from 'mongodb'
/* T_Types */
import type { T_Migration } from '@common/data/mongo/mongo'
/* CONSTANTS */
import { MONGO_DATABASE } from '@common/constants/helper'
import { ARCHIVE, COLLECTION, T_Archive, T_Post } from '@app/_lib/types'
import { default as SCHEMA_10_2_6 } from '@app/_lib/schema/10.2.6'
import { default as SCHEMA_10_3_2 } from '@app/_lib/schema/10.3.2'
import { default as SCHEMA_10_3_3 } from '@app/_lib/schema/10.3.3'
import { default as SCHEMA_10_3_4 } from '@app/_lib/schema/10.3.4'
/* Models */
import Cached from '@common/model/Cached'
/* Utils */
import { setOption } from '@app/admin/_lib/options'
import { updateBackgrounds } from '@app/admin/_lib/updateBackgrounds'

/**
 * Run this to create a user
 * mongosh --authenticationDatabase admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD $MONGO_DATABASE --eval "db.createUser({user: '$MONGO_USER', pwd: '$MONGO_PASSWORD', roles: [{role: 'readWrite', db: '$MONGO_DATABASE'}]});"
 * mongosh --authenticationDatabase admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD $MONGO_DATABASE --eval "db.updateUser('$MONGO_USER', {roles: [{role: 'dbAdmin', db: '$MONGO_DATABASE'}, {role: 'readWrite', db: '$MONGO_DATABASE'}]});"
 */
const migration: T_Migration = {
    '10.3.4': async (client) => {
        /**
         * Run this first
         * mongosh --authenticationDatabase admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD $MONGO_DATABASE --eval "db.updateUser('$MONGO_USER', {roles: [{role: 'dbAdmin', db: '$MONGO_DATABASE'}, {role: 'readWrite', db: '$MONGO_DATABASE'}]});"
         * Then, make user back to non-admin
         * mongosh --authenticationDatabase admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD $MONGO_DATABASE --eval "db.updateUser('$MONGO_USER', {roles: [{role: 'readWrite', db: '$MONGO_DATABASE'}]});"
         */

        const database = client.db(MONGO_DATABASE)
        const session = client.startSession()

        try {
            await session.withTransaction(async () => {
                // Add text index to post.content for search
                await database
                    .dropCollection(COLLECTION.USERS)
                    .catch(() => true)

                await database
                    .collection(COLLECTION.USERS)
                    .createIndex('email')
                    .then(async () => {
                        await database.command({
                            collMod: COLLECTION.USERS,
                            validator: {
                                $jsonSchema: SCHEMA_10_3_4.users,
                            },
                        })
                    })

                // Recipe Collection
                await database
                    .createCollection(COLLECTION.RECIPE, {
                        validator: {
                            $jsonSchema: SCHEMA_10_3_4.recipe,
                        },
                    })
                    .then(async () => {
                        await database
                            .collection(COLLECTION.RECIPE)
                            .createIndex({ search: 'text' })
                    })

                await setOption('version', '10.3.4')
            })
        } finally {
            await session.endSession()
            await client.close()
        }
    },
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
            collMod: COLLECTION.POST,
            validator: {
                $jsonSchema: SCHEMA_10_3_3.post,
            },
        })

        await database.createCollection(COLLECTION.ARCHIVE, {
            validator: {
                $jsonSchema: SCHEMA_10_3_3.archive,
            },
        })
        // Index
        await database
            .collection(COLLECTION.ARCHIVE)
            .createIndex(['slug', 'type'])

        // Insert tag to archive and hits
        await database
            .collection(`tag`)
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
                        .collection(COLLECTION.ARCHIVE)
                        .insertMany(archives)
                }
            })

        // Insert category to archive
        await database
            .collection(`category`)
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
                        .collection(COLLECTION.ARCHIVE)
                        .insertMany(archives)
                }
            })

        // Post terms to archives
        await database
            .collection(COLLECTION.POST)
            .aggregate([
                {
                    $lookup: {
                        from: COLLECTION.ARCHIVE,
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

                await database.collection(COLLECTION.POST).deleteMany({})

                if (inserts.length) {
                    await database
                        .collection(COLLECTION.POST)
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
            collMod: COLLECTION.PAGE,
            validator: {
                $jsonSchema: SCHEMA_10_3_2.page,
            },
        })
        database.command({
            collMod: COLLECTION.POST,
            validator: {
                $jsonSchema: SCHEMA_10_3_2.post,
            },
        })
    },
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
            await database.createCollection(`category`, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.category,
                },
            })
            // Index
            await database
                .collection(`category`)
                .createIndex('slug', { unique: true })
            await database.collection(`category`).createIndex('total')
        })()
        // Tag
        await (async () => {
            await database.createCollection(`tag`, {
                validator: {
                    $jsonSchema: SCHEMA_10_2_6.tags,
                },
            })
            // Index
            await database
                .collection(`tag`)
                .createIndex('slug', { unique: true })
            await database.collection(`tag`).createIndex('total')
            await database.collection(`tag`).createIndex('hits')
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
