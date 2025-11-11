// import type {
//     MongoClient,
//     Filter,
//     OptionalUnlessRequiredId,
//     InferIdType,
//     Document,
//     InsertOneOptions,
//     FindOptions,
//     Collection,
//     UpdateOptions,
//     DeleteOptions,
// } from 'mongodb'
// import { compareVersions } from '@common/utils/system'
// import Logger from '@common/model/Logger'
// import { DatabaseError } from '@common/model/Error'

// // import Mongo from './connection'
// import { PER_PAGE } from '@lib/constants/index'
// import { COLLECTION } from '@lib/types'

// export const getDatabase = async () => {
//     const client = await Mongo()
//     return client.db(process.env.MONGO_DATABASE)
// }

// export const getCollection = async <T extends Document>(collection: string) => {
//     const database = await getDatabase()
//     return database.collection<T>(collection)
// }

// export type T_Migration = {
//     [version: string]: (client: MongoClient) => Promise<void>
// }

// /**
//  * Migrate the index of the database.
//  *
//  * @param {string} current
//  * @param {string} target
//  * @param {T_Migration} migration
//  * @example
//  * await migrate('0.0.2', async (client) => { ... })
//  */
// export const migrate = async (
//     current: string,
//     target: string,
//     migration: T_Migration,
// ) => {
//     // Filter versions that are greater than the current version and less than or equal to the new version
//     const versions = Object.keys(migration)
//         .filter(
//             (v) =>
//                 compareVersions(current, v) === -1 &&
//                 compareVersions(target, v) >= 0,
//         )
//         .sort(compareVersions)

//     Logger.server(
//         `MongoDB migration: ${current} => ${target}, ${JSON.stringify(
//             versions,
//         )}`,
//     )
//     const client = await Mongo()
//     for (const version of versions) {
//         await migration[version](client)
//     }

//     return versions
// }

// /**
//  * @param collection
//  * @param doc
//  * @param options
//  * @throws {DatabaseError} Could not find the result
//  */
// export const findOne = async <T extends Document>(
//     collection: string | Collection<T>,
//     doc: Filter<T>,
//     options?: Omit<FindOptions, 'timeoutMode'>,
// ) => {
//     const table =
//         typeof collection === 'string'
//             ? await getCollection<T>(collection)
//             : collection
//     return await table.findOne(doc, options).then((result) => {
//         if (!result) {
//             throw new DatabaseError(
//                 'Mongo findOne does not have any result.',
//                 table.collectionName,
//                 doc,
//             )
//         }
//         return result
//     })
// }

// export const insertOne = async <T extends Document>(
//     collection: string | Collection<T>,
//     doc: OptionalUnlessRequiredId<T>,
//     options?: InsertOneOptions,
// ) => {
//     const table =
//         typeof collection === 'string'
//             ? await getCollection<T>(collection)
//             : collection
//     return await table.insertOne(doc, options)
// }

// export const updateOne = async <T extends Document>(
//     collection: string | Collection<T>,
//     filter: Filter<T>,
//     doc: T,
//     options?: UpdateOptions,
// ) => {
//     const table =
//         typeof collection === 'string'
//             ? await getCollection<T>(collection)
//             : collection
//     return await table.updateOne(filter, doc, options)
// }

// export const deleteOne = async <T extends Document>(
//     collection: string | Collection<T>,
//     filter: Filter<T>,
//     options?: DeleteOptions,
// ) => {
//     const table =
//         typeof collection === 'string'
//             ? await getCollection<T>(collection)
//             : collection
//     return await table.deleteOne(filter, options)
// }

// export const findWithCount = async <T extends Document>(
//     collection: string | Collection<T>,
//     filter: Filter<T>,
// ) => {
//     const table =
//         typeof collection === 'string'
//             ? await getCollection<T>(collection)
//             : collection
//     const find = table.find(filter)
//     const count = await table.countDocuments(filter)

//     return { find, count }
// }

// export const count = async <T extends Document>(
//     collection: string | Collection<T>,
//     filter: Filter<T>,
// ) => {
//     const table =
//         typeof collection === 'string'
//             ? await getCollection<T>(collection)
//             : collection
//     return await table.countDocuments(filter)
// }

// export const insertOrReplace = async <T extends Document>(
//     collection: string | Collection<T>,
//     filter: Filter<T>,
//     update: OptionalUnlessRequiredId<T>,
// ): Promise<InferIdType<T>> => {
//     const table =
//         typeof collection === 'string'
//             ? await getCollection<T>(collection)
//             : collection
//     return await table.findOne(filter).then(async (doc) => {
//         if (doc) {
//             await table.replaceOne(filter, update)
//             return doc._id
//         }
//         const result = await table.insertOne(update)
//         return result.insertedId
//     })
// }

// export const getAggregation = (
//     key: 'paging' | '_id' | 'expand-archive' | 'to-archive-post',
//     ...arr: (string | number)[]
// ) => {
//     switch (key) {
//         case 'paging':
//             if (typeof arr[0] === 'number') {
//                 return [
//                     {
//                         $sort: { date: -1 },
//                     },
//                     {
//                         $skip: PER_PAGE * (arr[0] - 1),
//                     },
//                     {
//                         $limit: PER_PAGE,
//                     },
//                 ]
//             }
//             break

//         case '_id':
//             if (arr[0]) {
//                 return [
//                     {
//                         $addFields: {
//                             [arr[0]]: { $toString: `$${arr[0]}` },
//                         },
//                     },
//                 ]
//             }

//             return [
//                 {
//                     $addFields: {
//                         _id: { $toString: '$_id' },
//                     },
//                 },
//             ]

//         case 'expand-archive':
//             return [
//                 {
//                     $lookup: {
//                         from: COLLECTION.ARCHIVE,
//                         localField: 'archives',
//                         foreignField: '_id',
//                         as: 'archives',
//                         pipeline: [
//                             {
//                                 $addFields: {
//                                     _id: { $toString: '$_id' },
//                                 },
//                             },
//                         ],
//                     },
//                 },
//             ]
//         case 'to-archive-post':
//             return [
//                 {
//                     $project: {
//                         content: 0,
//                         meta: 0,
//                     },
//                 },
//             ]
//     }

//     return []
// }
