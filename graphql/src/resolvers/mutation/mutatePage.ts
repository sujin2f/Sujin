// import sanitize from 'mongo-sanitize'
// /* T_Types */
// import type { MutationResultType } from '@src/types'
// /* Utils */
// import { auth } from '@src/utils/utils-mysql'
// import { updatePage } from '@src/utils/mongo/updatePage'

// /**
//  * Update Mongo Post type from MySQL for GraphQL
//  *
//  * @param {string} nonce - WP nonce
//  * @param {string} _slug - Post slug
//  * @returns {Promise<MutationResultType>}
//  */
// export const mutatePage = async (
//     nonce: string,
//     _slug: string,
// ): Promise<MutationResultType> => {
//     const slug = sanitize(_slug)
//     await auth(nonce, slug)
//     await updatePage(slug)
//     return {
//         result: true,
//     }
// }
