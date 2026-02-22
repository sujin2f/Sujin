/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import { REST_CATEGORIES } from '@sujin/lib/constants'
/* T_Types */
import type { T_RestArchive } from '@sujin/lib/types'

/**
 * Get a WordPress categories related a post from REST API.
 *
 * @param postId - WordPress Post ID
 */
export const getCategoriesFromPostId = async (postId: number): Promise<T_RestArchive[]> => {
    const requestURL = `${process.env.WP_REST_BASE_URL}/${REST_CATEGORIES}?post=${postId}`
    const categories = await fetch(requestURL, {
        method: 'GET',
        cache: 'force-cache',
    }).then(async (response) => {
        if (response.status !== 200) {
            Logger.error(`🤬 Failed to request REST category -- ${response.status}, ${requestURL}`)
            throw new Error(`🤬 Failed to request REST category -- ${response.status}, ${requestURL}`)
        }
        const json = (await response.json()) as T_RestArchive[]
        if (!json.length) {
            Logger.error(`🤬 Failed to request REST category -- ${requestURL}`)
            throw new Error(`🤬 Failed to request REST category -- ${requestURL}`)
        }
        return json
    })
    return categories
}

/**
 * Get a WordPress category from REST API.
 *
 * @param slug - category name
 */
export const getCategory = async (slug: string): Promise<T_RestArchive> => {
    const requestURL = `${process.env.WP_REST_BASE_URL}/${REST_CATEGORIES}?slug=${slug}`
    const categories = await fetch(requestURL, {
        method: 'GET',
        cache: 'force-cache',
    }).then(async (response) => {
        if (response.status !== 200) {
            Logger.error(`🤬 Failed to request REST category -- ${response.status}, ${requestURL}`)
            throw new Error(`🤬 Failed to request REST category -- ${response.status}, ${requestURL}`)
        }
        const json = (await response.json()) as T_RestArchive[]
        if (!json.length) {
            Logger.error(`🤬 Failed to request REST category -- ${requestURL}`)
            throw new Error(`🤬 Failed to request REST category -- ${requestURL}`)
        }
        return json
    })
    return categories[0]
}
