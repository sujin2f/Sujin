import type { Fields, OperationFields, IObjectType, Field } from '.'
import { Scalar } from './constants'
import { returnTypeToString } from './util'
import { Error } from '../model/Error'

type Props<T extends string> = {
    name: T
    fields?: Fields
}

export class GraphQLObjectType<T extends string> implements IObjectType<T> {
    readonly name: T
    readonly fields: Fields

    get isScalar() {
        return ['String', 'ID', 'Int', 'Float', 'Boolean'].includes(this.name)
    }

    public constructor(props: Props<T>) {
        this.name = props.name
        this.fields = props.fields || {}
    }

    addField(key: string, field: Field) {
        this.fields[key] = field
    }

    toString() {
        const fields = Object.entries(this.fields)
            .map(([field, value]) => {
                const { type, required, list } = value
                const name = type === 'self' ? this.name : type.name
                return `${field}: ${returnTypeToString(name, list, required)}`
            })
            .join('\n')
        return `type ${this.name} {\n${fields}\n}`
    }

    private validateOperation(...fields: OperationFields) {
        fields.forEach((field) => {
            if (typeof field === 'string') {
                if (!this.fields[field]) {
                    throw new Error(
                        `GraphQL object ${this.name} does not have a field ${field}`,
                    )
                }
                return
            }

            const key = Object.keys(field)[0]
            if (!this.fields[key]) {
                throw new Error(
                    `GraphQL object ${this.name} does not have a field ${key}`,
                )
            }
        })
    }

    toOperation(...fields: OperationFields) {
        this.validateOperation(...fields)
        const result = fields
            .map((field): string => {
                if (typeof field === 'string') {
                    return field
                }

                return Object.entries(field)
                    .map(([key, subFields]) => {
                        const type =
                            this.fields[key].type === 'self'
                                ? this
                                : this.fields[key].type
                        return `${key} ${type.toOperation(...subFields)}`
                    })
                    .join('\n')
            })
            .join('\n')

        return `{\n${result}\n}`
    }
}

export const GraphQLInt = new GraphQLObjectType<Scalar>({
    name: Scalar.INT,
})
export const GraphQLFloat = new GraphQLObjectType<Scalar>({
    name: Scalar.FLOAT,
})
export const GraphQLString = new GraphQLObjectType<Scalar>({
    name: Scalar.STRING,
})
export const GraphQLBoolean = new GraphQLObjectType<Scalar>({
    name: Scalar.BOOLEAN,
})
export const GraphQLID = new GraphQLObjectType<Scalar>({
    name: Scalar.ID,
})
