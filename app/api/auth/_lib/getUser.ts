'use server'
import { Binary } from 'mongodb'
import { hash } from 'node:crypto'
import sanitize from 'mongo-sanitize'

import { findOne } from '@common/data/mongo/mongo'
import { COLLECTION, type T_SessionUser } from '@app/_lib/types'
import { decodeText } from '@app/_lib/utils/crypto'

/**
 *
 * @param email
 * @returns {Promise<T_Stringify<T_UserParsed>>}
 * @throws {DatabaseError} from findOne()
 */
export const getUser = async (
    _email: string,
): Promise<Partial<T_SessionUser>> => {
    const email = sanitize(_email)
    const user = await findOne(COLLECTION.USERS, {
        email: new Binary(Buffer.from(hash('md5', email)), Binary.SUBTYPE_MD5),
    }).then(async (user) => {
        const name = await decodeText(user.name.buffer)
        return {
            _id: user._id.toString(),
            name,
            image: user.image,
        }
    })
    return user
}
