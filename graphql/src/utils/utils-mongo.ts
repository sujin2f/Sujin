// import { Binary, type WithoutId } from 'mongodb'
// import { createHash } from 'node:crypto'
// import sanitize from 'mongo-sanitize'
// /* Utils */
// import { getCollection, findOne } from '@src/utils/mongo'
// import { encodeText, decodeText } from '@lib/utils/crypto'
// /* T_Types */
// import {
//     COLLECTION,
//     type T_User,
//     type T_SessionUser,
//     T_ImageBlock,
//     IMAGE_SIZE,
// } from '@lib/types'

// export const addUser = async (
//     _email: string,
//     _name: string,
//     _image: string,
// ) => {
//     const email = sanitize(_email)
//     const name = sanitize(_name)
//     const image = sanitize(_image)
//     const collection = await getCollection<WithoutId<T_User>>(COLLECTION.USERS)
//     await collection.insertOne({
//         name: new Binary(Buffer.from(await encodeText(name))),
//         email: new Binary(
//             Buffer.from(createHash('md5').update(email).digest('hex')),
//             Binary.SUBTYPE_MD5,
//         ),
//         image,
//     })
// }

// /**
//  *
//  * @param email
//  * @returns {Promise<T_Stringify<T_UserParsed>>}
//  * @throws {DatabaseError} from findOne()
//  */
// export const getUser = async (
//     _email: string,
// ): Promise<Partial<T_SessionUser>> => {
//     const email = sanitize(_email)
//     const user = await findOne(COLLECTION.USERS, {
//         email: new Binary(
//             Buffer.from(createHash('md5').update(email).digest('hex')),
//             Binary.SUBTYPE_MD5,
//         ),
//     }).then(async (user) => {
//         const name = await decodeText(user.name.buffer)
//         return {
//             _id: user._id.toString(),
//             name,
//             image: user.image,
//         }
//     })
//     return user
// }
