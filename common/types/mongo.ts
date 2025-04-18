import type { ObjectId, WithId, Document } from 'mongodb'

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
 * type MongoPost = Mongo<Post>
 * same with: {
 *     _id: ObjectId
 *     user: ObjectId
 *     users: ObjectId[]
 * }
 */
export type T_Mongo<T extends WithId<Document>> = {
    [P in keyof T]: T[P] extends WithId<Document> | undefined
        ? ObjectId
        : T[P] extends WithId<Document>[] | undefined
        ? ObjectId[]
        : T[P]
}

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
    ? { bsonType: 'int' } | { bsonType: 'float' }
    : T extends Date | undefined // date
    ? { bsonType: 'date' }
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
