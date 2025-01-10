import type { ITypeScalar, GQLField, IType, ScalarJSType } from '.'
import { Scalar } from './constants'
import { fieldToString } from './util'

/**
 * Field of GQL Type
 * User, or Article of { user: User } or { article: [Article]! }
 *
 * @template T return type
 * @implements {IType}
 */
export class GQLType<T> implements IType<T> {
    readonly name: string
    readonly fields: Record<string, GQLField<unknown>>

    constructor(name: string, fields: Record<string, GQLField<unknown>>) {
        this.name = name

        // fields is required
        if (!Object.keys(fields).length) {
            throw Error('GraphQL Type should contain fields.')
        }

        this.fields = fields
    }

    /**
     * Get field to string: String or [Int]
     */
    toString() {
        const fields = Object.entries(this.fields)
            .map(([key, field]) => `${key}: ${fieldToString(field)}`)
            .join('\n')
        return `type ${this.name} {\n${fields}\n}`
    }

    /**
     * For circular reference
     */
    addField(id: string, value: GQLField<unknown>) {
        this.fields[id] = value
    }
}

/**
 * GQL default scalar Type
 *
 * @template R return type
 * @implements {ITypeScalar}
 */
class GQLTypeScalar<R extends ScalarJSType> implements ITypeScalar<R> {
    readonly name: Scalar

    constructor(name: Scalar) {
        this.name = name
    }
}

/**
 * GQL type Scalar: String | Int...
 */
export const GQLInt = new GQLTypeScalar<number>(Scalar.INT)
export const GQLFloat = new GQLTypeScalar<number>(Scalar.FLOAT)
export const GQLString = new GQLTypeScalar<string>(Scalar.STRING)
export const GQLBoolean = new GQLTypeScalar<boolean>(Scalar.BOOLEAN)
export const GQLID = new GQLTypeScalar<string>(Scalar.ID)
