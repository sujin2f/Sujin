import type { GQLField } from '.'

export const fieldToString = <T>(field: GQLField<T>) => {
    const required = field.required ? '!' : ''
    const result = field.list ? `[${field.type.name}]` : field.type.name
    return `${result}${required}`
}
