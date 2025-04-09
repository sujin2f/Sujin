/* Models */
import MySQL from '@app/_lib/data/mysql'
/* CONSTANTS */
import { MySQLQuery, PER_PAGE } from '@app/_lib/data/mysql/constants'
import {
    ARCHIVE,
    TAXONOMY,
    type POST_TYPE,
    type T_Term,
    type T_MySQLPost,
} from '@app/_lib/types'
/* Utils */
import { autop } from '@app/_lib/data/mysql/utils'
import { unserialize } from '@app/_lib/data/mysql/utils'
import { getTermsByPost } from '@app/_lib/data/mysql/term'
import { getPostImages } from '@app/_lib/data/mysql/media'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'

type T_PostMeta = {
    meta_key: string
    meta_value: string
}

// @deprecated not used anymore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllPostMeta = async (
    postId: number,
): Promise<Record<string, string>> => {
    const query = MySQLQuery.getAllPostMeta(postId)
    const result = await MySQL.getInstance().select<T_PostMeta>(query)

    return result.reduce((acc: Record<string, string>, meta) => {
        return {
            ...acc,
            [meta.meta_key]: meta.meta_value,
        }
    }, {})
}

export const getPostMeta = async <
    T extends Record<string, unknown> | string | number | boolean,
>(
    postId: number,
    metaKey: string,
    defaultValue: T,
): Promise<T> => {
    const mysql = MySQL.getInstance()
    const value = await mysql
        .selectOne<T_PostMeta>(MySQLQuery.getPostMeta(postId, metaKey))
        .catch(() => undefined)

    if (!value) {
        return defaultValue
    }

    return unserialize<T>(value.meta_value, defaultValue)
}

export const getPostBy = async (
    queryKey: 'id' | 'slug',
    queryValue: string | number,
    type: POST_TYPE,
    ignoreStatus = false,
): Promise<T_MySQLPost> => {
    return await getPostsBy(queryKey, type, queryValue, 1, ignoreStatus).then(
        (result) => {
            if (!result[0]) {
                throw new ServerError(
                    ERROR_MESSAGE.POST.SQL_GET_ONE,
                    'getPostBy()',
                    queryKey,
                    queryValue,
                )
            }
            return result[0]
        },
    )
}

const getPostQuery = (
    queryKey: 'search' | 'id' | 'slug' | ARCHIVE,
    type: POST_TYPE,
    queryValue?: string | number,
    page = 1,
    ignoreStatus = false,
): string => {
    switch (queryKey) {
        case 'id':
            return !queryValue
                ? ''
                : MySQLQuery.getPostBy(
                      'posts.ID',
                      queryValue,
                      type,
                      0,
                      ignoreStatus,
                  )
        case 'slug':
            return !queryValue
                ? ''
                : MySQLQuery.getPostBy(
                      'posts.post_name',
                      queryValue,
                      type,
                      0,
                      ignoreStatus,
                  )
        case 'search':
            return !queryValue
                ? ''
                : MySQLQuery.getSearch(queryValue, (page - 1) * PER_PAGE)

        case ARCHIVE.CATEGORY:
        case ARCHIVE.TAG:
            return !queryValue
                ? ''
                : MySQLQuery.getTermItems(
                      queryValue.toString(),
                      (page - 1) * PER_PAGE,
                      ignoreStatus,
                  )
    }
}

export const getPostsBy = async (
    queryKey: 'search' | 'id' | 'slug' | ARCHIVE,
    type: POST_TYPE,
    queryValue?: string | number,
    page = 1,
    ignoreStatus = false,
): Promise<T_MySQLPost[]> => {
    const query = getPostQuery(queryKey, type, queryValue, page, ignoreStatus)
    const result = await MySQL.getInstance().select<T_MySQLPost>(query)

    // Create Post from dbResult
    const posts: T_MySQLPost[] = []
    for await (const post of result) {
        const terms: T_Term[] = await getTermsByPost(post.id)
        const meta = {
            useBackgroundColor: await getPostMeta<boolean>(
                post.id,
                'use-background-color',
                false,
            ).then((response) => !!response),
            backgroundColor: await getPostMeta<string>(
                post.id,
                'background-color',
                '',
            ),
        }
        const images = await getPostImages(post)

        posts.push({
            ...post,
            images,
            meta,
            content: autop(post.content),
            terms: terms.map((term) =>
                term.type.toString() === TAXONOMY.POST_TAG
                    ? { ...term, type: TAXONOMY.TAG }
                    : term,
            ),
            link: post.type === 'page' ? `/${post.slug}` : `/blog/${post.slug}`,
        })
    }

    return posts
}
