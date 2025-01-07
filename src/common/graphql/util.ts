import type { Argument, IObjectType } from '.'
import { Scalar } from './constants'

export const returnTypeToString = (
    name: string,
    list = false,
    required = false,
) => `${list ? '[' : ''}${name}${list ? ']' : ''}${required ? '!' : ''}`

export const argumentsToString = (args: Record<string, Argument<Scalar>>) => {
    const str = Object.entries(args)
        .map(
            ([key, value]) =>
                `${key}: ${returnTypeToString((value.type as IObjectType<string>).name, false, value.required)}`,
        )
        .join(', ')
    return str ? `(${str})` : ''
}
