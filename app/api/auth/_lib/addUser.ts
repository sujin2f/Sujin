'use server'
import { Binary, type WithoutId } from 'mongodb'
import { createHash } from 'node:crypto'
import sanitize from 'mongo-sanitize'

import { getCollection } from '@common/data/mongo/mongo'
import { COLLECTION, type T_User } from '@app/_lib/types'
import { encodeText } from '@app/_lib/utils/crypto'

export const addUser = async (
    _email: string,
    _name: string,
    _image: string,
) => {
    const email = sanitize(_email)
    const name = sanitize(_name)
    const image = sanitize(_image)
    const collection = await getCollection<WithoutId<T_User>>(COLLECTION.USERS)
    await collection.insertOne({
        name: new Binary(Buffer.from(await encodeText(name))),
        email: new Binary(
            Buffer.from(createHash('md5').update(email).digest('hex')),
            Binary.SUBTYPE_MD5,
        ),
        image,
    })
}
