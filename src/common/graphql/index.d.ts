import { Scalar } from './constants'

export type Argument<T extends Scalar> = {
    type: IObjectType<T> | 'self'
    required?: boolean
}

export type ReturnType<T extends string> = {
    type: IObjectType<T> | 'self'
    list?: boolean
}

export type Field = Argument<string> & ReturnType<string>

export type Fields = Record<string, Field>
export type OperationFields = (string | Record<string, OperationFields>)[]
export type OperationArgs = Record<string, string | number | boolean>

export interface IObjectType<T extends string> {
    readonly name: T
    readonly fields: Fields
    toString: () => string
    toOperation: (...field: OperationFields) => string
}

export interface IQuery {
    readonly name: string
    readonly return: ReturnType<string>
    readonly arguments: Record<string, Argument<Scalar>>
    toString: () => string
}

export interface IOperation<T> {
    readonly query: IQuery
    readonly fields: OperationFields
    toString: (args: T) => string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetOperationArgsType<C extends IOperation<any>> =
    C extends IOperation<infer T> ? T : unknown
