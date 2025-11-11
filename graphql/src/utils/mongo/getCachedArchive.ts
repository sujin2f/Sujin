// import sanitize from 'mongo-sanitize'
// /* Models */
// import { NoContentError } from '@common/model/Error'
// /* CONSTANTS */
// import { ARCHIVE, COLLECTION, T_Archive } from '@lib/types'
// /* Utils */
// import { findOne } from '@src/utils/mongo'
// import { cachedRequest, getCacheKey } from '@lib/utils/cache'

// const query = async (_slug: string, _type: ARCHIVE): Promise<T_Archive> => {
//     const slug = sanitize(_slug)
//     const type = sanitize(_type)

//     return await findOne<T_Archive>(COLLECTION.ARCHIVE, { slug, type }).then(
//         (archive) => {
//             if (!archive.total) {
//                 throw new NoContentError(
//                     'Archive is empty.',
//                     slug,
//                     type,
//                 ).setMetadata(archive)
//             }
//             return archive
//         },
//     )
// }

// /**
//  * Get archive by slug
//  *
//  * @param {string} _slug
//  * @param {ARCHIVE} _type
//  * @returns {Promise<T_Archive>}
//  */
// export const getCachedArchive = async (
//     slug: string,
//     type: ARCHIVE,
// ): Promise<T_Archive> => {
//     const request = cachedRequest(
//         query,
//         getCacheKey(COLLECTION.ARCHIVE, type, slug),
//     )
//     return await request(slug, type)
// }
