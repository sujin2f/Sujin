/* Models */
import Logger from '@common/model/Logger'
import MySQL from '@app/_lib/data/mysql'
/* Types */
import {
    ARCHIVE,
    type MySQLPostType,
    type POST_TYPE,
    type PostMetaType,
    type TermType,
} from '@app/_lib/types/wordpress'
/* Constants */
import { MySQLQuery, PER_PAGE } from '@app/_lib/data/mysql/constants'
/* Utils */
import { autop } from '@app/_lib/utils/wordpress'
import { unserialize } from '@app/_lib/utils/wordpress'
import { getTermsByPost } from '@app/_lib/data/mysql/term'
import { getPostImages } from '@app/_lib/data/mysql/media'

export const getAllPostMeta = async (
    postId: number,
): Promise<Record<string, string>> => {
    const query = MySQLQuery.getAllPostMeta(postId)
    const result = await MySQL.getInstance().select<PostMetaType>(query)

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
        .selectOne<PostMetaType>(MySQLQuery.getPostMeta(postId, metaKey))
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
): Promise<MySQLPostType> => {
    return await getPostsBy(queryKey, type, queryValue, 1, ignoreStatus).then(
        (result) => {
            if (!result[0]) {
                throw Error(
                    `Fail to get post with queryKey: ${queryKey} and queryValue ${queryValue}`,
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
                  )
    }
}

export const getPostsBy = async (
    queryKey: 'search' | 'id' | 'slug' | ARCHIVE,
    type: POST_TYPE,
    queryValue?: string | number,
    page = 1,
    ignoreStatus = false,
): Promise<MySQLPostType[]> => {
    Logger.server(
        `Calling MySQL getPostsBy: ${queryKey}, ${queryValue}, ${type}, and ${ignoreStatus}.`,
    )

    const query = getPostQuery(queryKey, type, queryValue, page, ignoreStatus)
    const result = await MySQL.getInstance().select<MySQLPostType>(query)

    // Create Post from dbResult
    const posts: MySQLPostType[] = []
    for await (const post of result) {
        const terms: TermType[] = await getTermsByPost(post.id)
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
            content: autop(post.content),
            terms: terms.map((term) =>
                term.type.toString() === 'post_tag'
                    ? { ...term, type: ARCHIVE.TAG }
                    : term,
            ),
            images,
            meta,
        })
    }

    return posts
}
