import { Scalar } from './constants'
import { Nullable } from '../types'

type ScalarJSType = string | number | boolean

/**
 * GQL Scalar Type
 * String or Int of { name: String } or { ref: [Int] }
 * @template T typescript filed type
 */
interface ITypeScalar<T extends ScalarJSType> {
    name: Scalar | string
}

/**
 * GQL custom Type
 * @template T typescript filed type
 */
interface IType<T> extends ITypeScalar {
    name: string
    fields: Record<string, GQLField>
    toString: () => string
}

type GQLField<T> = {
    type: ITypeScalar<T> | IType<T>
    list?: boolean
    required?: boolean
}

// (id: ID!)
type IQueryArgs = Record<string, { type: ITypeScalar; required?: boolean }>
//

type QueryReturnType<T> = {
    type: IType<T>
    list?: boolean
}

/**
 * GQL custom Type
 * @template A argument type as tuple
 * @template R return type
 */
interface IQuery<A extends ScalarJSType[], R> {
    readonly name: string
    readonly rtn: QueryReturnType<R>
    readonly args?: IQueryArgs

    callback: IQuery
    toString(): string
    toOperation(fields: string, ...args: A): string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// type GetOperationArgsType<C extends IOperation<any>> =
//     C extends IOperation<infer T> ? T : unknown

// type QueryArgument<C extends IQuery<any>> =
//     C extends IQuery<infer A> ? A : unknown

// type QueryReturn<C extends IQuery<Record<string, ReturnTypeScalar>, any>> =
//     C extends IQuery<A, infer R> ? R : unknown
