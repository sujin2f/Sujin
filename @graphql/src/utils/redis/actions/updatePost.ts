/* CONSTANTS */
import { POST_TYPE } from '@sujin/lib/constants'
/* Utils */
import { updatePost as updateMongoPost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'
import { getPostBy } from '@src/utils/mysql/post'

/**
 * Refresh a single post from MySQL.
 *
 * @param slug - Post slug to refresh.
 */
export const updatePost = async (slug: string): Promise<void> => {
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        const archives = await updateMongoPost(post)
        await updateTotal(archives)
    })
    await mysqlDisconnect()
}

// TODO Post from mySQL > REST #211
// /**
//  * Refresh a single post from WP REST.
//  *
//  * @param slug - Post slug to refresh.
//  */
// import { removeCache } from '@src/utils/redis/cache'
// import { MenuItem } from '@src/schema/menu'
// import { REST_MENU_ITEMS, REST_POSTS } from '@sujin/lib/constants/wordpress'
// import { COLLECTION } from '@sujin/lib/constants'
// /* T_Types */
// import type { T_Page, T_RestPost } from '@sujin/lib/types'
// /* Models */
// import { Logger } from '@sujin/share/model/Logger'
// export const updatePost = async (slug: string) => {
//     const requestURL = `${process.env.WP_REST_BASE_URL}/${REST_POSTS}?slug=${slug}`
//     const wpPost = await fetch(requestURL, {
//         method: 'GET',
//         cache: 'force-cache',
//     }).then(async (response) => {
//         if (response.status !== 200) {
//             Logger.error(`🤬 Failed to request REST posts -- ${response.status}, ${requestURL}`)
//             throw new Error(`🤬 Failed to request REST posts -- ${response.status}, ${requestURL}`)
//         }
//         const json = (await response.json()) as T_RestPost[]
//         if (!json.length) {
//             Logger.error(`🤬 Failed to request REST posts -- ${requestURL}`)
//             throw new Error(`🤬 Failed to request REST posts -- ${requestURL}`)
//         }
//         return json[0]
//     })

//     await removeCache(COLLECTION.POST, 'archive')
//     await removeCache(COLLECTION.POST, slug)

//     Logger.info(`⭐️ updatePost done: ${slug}`)
// }
