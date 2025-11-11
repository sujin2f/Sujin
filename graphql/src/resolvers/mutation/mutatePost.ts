// import sanitize from 'mongo-sanitize'
// /* Models */
// import Cached from '@common/model/Cached'
// /* T_Types */
// import type { MutationResultType } from '@src/types'
// /* Utils */
// import { auth } from '@src/utils/utils-mysql'
// import { getPostBy } from '@src/utils/mysql/getPostBy'
// import { getCacheKey } from '@lib/utils/cache'
// import { updateTotal } from '@src/utils/mongo/updateTotal'
// import { updateFromMySQL } from '@src/utils/mongo/updateFromMySQL'
// /* CONSTANTS */
// import { COLLECTION, POST_TYPE } from '@lib/types'

// export const mutatePost = async (
//     nonce: string,
//     _slug: string,
// ): Promise<MutationResultType> => {
//     const slug = sanitize(_slug)
//     await auth(nonce, slug)

//     Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
//     await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
//         const archives = await updateFromMySQL(post)
//         await updateTotal(archives)
//     })

//     return {
//         result: true,
//     }
// }
