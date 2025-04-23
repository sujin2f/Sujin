import { getServerSession } from 'next-auth'
import type { WithoutId } from 'mongodb'
import { hash } from 'node:crypto'

import { getCollection } from '@common/data/mongo/mongo'
import { COLLECTION, type T_User } from '@app/_lib/types'
import { authOptions } from '@app/api/auth/constants'
import { getOption, removeOption } from '@app/_lib/data/mysql/option'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'

export const addUser = async (user: WithoutId<T_User>) => {
    const collection = await getCollection(COLLECTION.USERS)
    await collection.insertOne({
        ...user,
        email: hash('md5', user.email),
    })
}

export const getUser = async (email: string) => {
    const collection = await getCollection(COLLECTION.USERS)
    return await collection.findOne({ email: hash('md5', email) })
}

export const isAdmin = async (): Promise<boolean> => {
    const session = await getServerSession(authOptions)
    return session?.user?.email === process.env.ADMIN_EMAIL
}

/**
 * User admin and WP nonce allow to access
 *
 * @param {string} nonce
 * @param {string} slug
 * @param {ARCHIVE | POST_TYPE} type
 * @returns {Promise<void>}
 * @throws {ServerError} Failed to access
 */
export const auth = async (nonce?: string, slug?: string): Promise<void> => {
    const admin = await isAdmin()
    if (admin) return

    // Nonce validation
    if (!nonce) {
        throw new ServerError(ERROR_MESSAGE.GENERAL.UNAUTHORIZED, 'auth()')
    }
    const optionKey = ['mutate', slug, nonce].join('_')
    await getOption(optionKey).catch(() => {
        throw new ServerError(ERROR_MESSAGE.GENERAL.UNAUTHORIZED, 'auth()')
    })
    await removeOption(optionKey)
}
