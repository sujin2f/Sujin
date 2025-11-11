// /* Mongoose */
// import { Background } from '@src/schema/background'
// /* CONSTANTS */
// import { COLLECTION } from '@lib/types'
// /* Utils */
// import { cachedRequest, getCacheKey } from '@lib/utils/cache'
// /* T_Types */
// import type { T_Background } from '@lib/types'

// /**
//  * Get backgrounds
//  * This returns the cached result if it exists
//  *
//  * @returns {Promise<T_Background[]>} - The background array
//  */
// export const getBackgrounds = async (): Promise<T_Background[]> => {
//     const request = cachedRequest(query, getCacheKey(COLLECTION.BACKGROUNDS))
//     return await request()
// }

// const query = async (): Promise<T_Background[]> => {
//     return await Background.aggregate<T_Background>([{ $sample: { size: 10 } }])
// }
