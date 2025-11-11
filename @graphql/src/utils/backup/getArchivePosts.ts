// 'use server'
// import type { ObjectId, Document } from 'mongodb'
// import sanitize from 'mongo-sanitize'
// /* Models */
// import { NoContentError } from '@sujin/common/model/Error'
// /* Utils */
// import { getCollection, getAggregation } from '@src/utils/mongo'
// /* CONSTANTS */
// import {
//     POST_STATUS,
//     COLLECTION,
//     type T_Post,
//     type T_ArchivePost,
// } from '@sujin/lib/types'
// /* T_Types */
// import type { T_Mongo } from '@sujin/common/types/mongo'

// export const getArchivePosts = async (
//     _id: ObjectId,
//     page: number,
//     status?: POST_STATUS,
// ): Promise<T_ArchivePost[]> => {
//     const collection = await getCollection<T_Mongo<T_Post>>(COLLECTION.POST)
//     const match: Document = { archives: _id }
//     if (status) {
//         match.status = status
//     }

//     const posts = await collection
//         .aggregate<T_ArchivePost>([
//             {
//                 $match: match,
//             },
//             {
//                 $sort: { date: -1 },
//             },
//             ...getAggregation('paging', sanitize(page)),
//             ...getAggregation('expand-archive'),
//             ...getAggregation('to-archive-post'),
//         ])
//         .toArray()

//     if (!posts.length) {
//         throw new NoContentError(`Archive ${_id.toString()} is empty`)
//     }

//     return posts
// }
