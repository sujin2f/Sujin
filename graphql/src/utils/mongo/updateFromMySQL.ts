// import { ObjectId } from 'mongodb'
// /* Models */
// import Cached from '@common/model/Cached'
// import { DatabaseError } from '@common/model/Error'
// /* Utils */
// import { convertImageBlockURL } from '@src/utils/utils-mongo'
// import { getCacheKey } from '@lib/utils/cache'
// import { schemaFormatter } from '@common/utils/object'
// /* CONSTANTS */
// import { default as schema } from '@src/schema/10.3.4'
// import {
//     ARCHIVE,
//     COLLECTION,
//     type POST_IMAGE_LOCATION,
//     type T_Post,
//     type T_MySQLPost,
//     type T_Archive,
// } from '@lib/types'
// import { formatter as archiveFormatter } from '@src/utils/mongo/updateArchive'
// import { findOne, getCollection, insertOrReplace } from '.'

// const format = (post: Record<string, unknown>): T_Post =>
//     schemaFormatter(post, schema.post) as T_Post

// export const updateFromMySQL = async (post: T_MySQLPost) => {
//     const slug = post.slug
//     const archives: ObjectId[] = []
//     Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))

//     // Image
//     Object.keys(post.images).forEach((key) => {
//         const imageKey = key as POST_IMAGE_LOCATION
//         post.images[imageKey] = convertImageBlockURL(post.images[imageKey]!)
//     })

//     for (const term of post.terms.filter(
//         (term) => term.type === ARCHIVE.CATEGORY || term.type === ARCHIVE.TAG,
//     )) {
//         const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
//         await findOne(collection, {
//             slug: term.slug,
//             type: term.type,
//         })
//             .then((archive) => {
//                 // archives.push(archive._id)
//             })
//             .catch(async (e) => {
//                 if (!(e instanceof DatabaseError)) {
//                     throw e
//                 }
//                 const result = await collection.insertOne(
//                     archiveFormatter({ ...term, hits: 0, total: 0 }),
//                 )
//                 // archives.push(result.insertedId)
//             })
//     }

//     await insertOrReplace<T_Post>(
//         COLLECTION.POST,
//         {
//             slug,
//         },
//         format({ ...post, archives }),
//     )

//     return archives
// }
