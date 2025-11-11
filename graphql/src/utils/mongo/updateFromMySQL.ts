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
