import { getServerSession } from 'next-auth'
import { Binary, type WithoutId } from 'mongodb'
import { hash } from 'node:crypto'

import { getCollection } from '@common/data/mongo/mongo'
import { COLLECTION, type T_User } from '@app/_lib/types'
import { authOptions } from '@app/api/auth/constants'
import { getOption, removeOption } from '@app/_lib/data/mysql/option'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'
import { decodeText, encodeText } from '@app/_lib/utils-server'

export const addUser = async (email: string, name: string, image: string) => {
    const collection = await getCollection<WithoutId<T_User>>(COLLECTION.USERS)
    await collection.insertOne({
        name: new Binary(Buffer.from(await encodeText(name))),
        email: new Binary(Buffer.from(hash('md5', email)), Binary.SUBTYPE_MD5),
        image,
    })
}

export const getUser = async (email: string) => {
    const collection = await getCollection<WithoutId<T_User>>(COLLECTION.USERS)
    const user = await collection
        .findOne({
            email: new Binary(
                Buffer.from(hash('md5', email)),
                Binary.SUBTYPE_MD5,
            ),
        })
        .then(async (user) => {
            if (!user) {
                return null
            }

            const name = await decodeText(user.name.buffer)
            return {
                _id: user._id,
                name,
                image: user.image,
            }
        })
    return user
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
