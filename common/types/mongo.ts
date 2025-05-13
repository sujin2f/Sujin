import type { ObjectId, WithId, Binary, Document } from 'mongodb'

/**
 * Type for MongoDB and its relational result
 *
 * @example
 * type User = WithId<{
 *     name: string
 * }>
 * type Post = WithId<{
 *     user: User
 *     users: User[]
 * }>
 *
 * // Automatically converts user to ObjectId
 * type MongoPost = T_Mongo<Post>
 * same with: {
 *     _id: ObjectId
 *     user: ObjectId
 *     users: ObjectId[]
 * }
 *
 * // Add exception
 * type MongoPost = T_Mongo<Post, 'user'>
 * same with: {
 *     _id: ObjectId
 *     user: User
 *     users: ObjectId[]
 * }
 *
 * // ObjectId to string
 * type MongoPost = T_Stringify<Post, 'user'>
 * same with: {
 *     _id: string
 *     user: User
 *     users: string[]
 * }
 */
export type T_Mongo<
    T extends WithId<Document>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    K extends keyof any = '',
    I = ObjectId,
> = {
    [P in keyof T]: P extends K
        ? T[P]
        : P extends K[]
        ? T[P]
        : T[P] extends WithId<Document> | undefined
        ? I
        : T[P] extends WithId<Document>[] | undefined
        ? I[]
        : T[P] extends ObjectId
        ? I
        : T[P]
}

export type T_Stringify<
    T extends WithId<Document>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    K extends keyof any = '',
> = T_Mongo<T, K, string>

/**
 * Get type of array member
 * @example
 * type S = string[]
 * type T = GetArrayElementType<S> // 'string'
 */
type GetArrayElementType<T extends unknown[]> = T extends (infer U)[]
    ? U
    : never

/**
 * Get required keys from object type
 * @example
 * type Post = WithId<{
 *     user: User
 *     users?: User[]
 * }>
 * RequiredKeys<Post> // '_id' | 'user'
 */
type RequiredKeys<T> = keyof {
    [P in keyof Required<T> as Pick<T, P> extends Required<Pick<T, P>>
        ? P
        : never]: T[P]
}

export type T_MongoSchemaProperties<T> = {
    [key in keyof Omit<Required<T>, '_id'>]: T_MongoSchema<T[key]>
}

export type T_MongoSchema<T> = T extends unknown[] // Array
    ? {
          bsonType: 'array'
          items: T_MongoSchema<GetArrayElementType<T>>
      }
    : T extends ObjectId | undefined // ObjectId
    ? { bsonType: 'objectId' }
    : T extends string | undefined // string
    ? { bsonType: 'string'; enum?: string[] }
    : T extends number | undefined // number
    ? { bsonType: 'int' } | { bsonType: 'double' }
    : T extends Date | undefined // date
    ? { bsonType: 'date' }
    : T extends Binary | undefined // boolean
    ? { bsonType: 'binData' }
    : T extends boolean | undefined // boolean
    ? { bsonType: 'bool' }
    : T extends object
    ? {
          bsonType: 'object'
          title?: string
          required?: RequiredKeys<T>[]
          properties: T_MongoSchemaProperties<T>
      }
    : object
