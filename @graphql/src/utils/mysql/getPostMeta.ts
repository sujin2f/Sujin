/* Models */
import { select } from '@sujin/mysql'
import Logger from '@sujin/share/model/Logger'
/* CONSTANTS */
import { MySQLQuery } from '@src/utils/mysql/constants'
/* Utils */
import { phpUnSerialize } from '@sujin/share/utils/string'

type T_PostMeta = {
    meta_key: string
    meta_value: string
}

export const getPostMeta = async <
    T extends Record<string, unknown> | string | number | boolean,
>(
    postId: number,
    metaKey: string,
    defaultValue: T,
): Promise<T> => {
    const value = await select<T_PostMeta>(
        MySQLQuery.getPostMeta(postId, metaKey),
    )
        .then((value: T_PostMeta[]) => value[0])
        .catch(() => undefined)

    if (!value) {
        return defaultValue
    }

    return unserialize<T>(value.meta_value, defaultValue)
}

const unserialize = <
    T extends Record<string, unknown> | string | number | boolean,
>(
    value: string,
    defaultValue: T,
    key?: string,
): T => {
    if (typeof defaultValue !== 'string') {
        switch (typeof defaultValue) {
            case 'boolean':
                return !!value as T
            case 'number':
                return (parseInt(value) as T) || defaultValue
        }
    }

    if (!value) {
        return defaultValue
    }

    if (!value.startsWith('a:') || !value.endsWith('}')) {
        return value as T
    }

    let result
    try {
        result = phpUnSerialize(value)
    } catch (e) {
        Logger.server('phpUnSerialize could not parse the value', value, e)
        throw Error('phpUnSerialize could not parse the value')
    }

    if (key && typeof result === 'object') {
        if (Object.keys(result as object).includes(key)) {
            return (result as Record<string, T>)[key]
        }
        return defaultValue
    }
    return result as T
}
