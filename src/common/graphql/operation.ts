import type { OperationFields, IQuery, IOperation, OperationArgs } from '.'
import { Error } from '../model/Error'

export class Operation<T extends OperationArgs> implements IOperation<T> {
    readonly query: IQuery
    readonly args: string[]
    readonly fields: OperationFields

    private readonly TYPE_VALIDATION = [
        [['String', 'ID'], 'string'],
        [['Int', 'Float'], 'number'],
        [['Boolean'], 'boolean'],
    ]

    constructor(query: IQuery, args: string[], ...fields: OperationFields) {
        this.query = query
        this.args = args
        this.fields = fields
    }

    toString(args: T) {
        this.validateOperation(args)
        let argsString = this.args
            .map((key) => {
                const argValue = args[key]
                let value = argValue
                if (typeof value === 'string') {
                    value = `"${value}"`
                }
                if (typeof value === 'boolean') {
                    value = value ? 'true' : 'false'
                }
                return `${key}: ${value}`
            })
            .join(', ')
        if (this.query.return.type === 'self') {
            throw new Error(`Operation return type should not be self.`)
        }
        const filedString = this.query.return.type.toOperation(...this.fields)
        argsString = argsString ? `(${argsString})` : ''
        return `{\n${this.query.name}${argsString} ${filedString}\n}`
    }

    private validateOperation(args: T) {
        // Validation Required
        Object.entries(this.query.arguments)
            .filter(([, value]) => value.required)
            .forEach(([key]) => {
                if (!this.args.includes(key)) {
                    throw new Error(
                        `GraphQL argument ${key} is required in query ${this.query.name}`,
                    )
                }
            })

        // Validation type
        const keys = Object.keys(this.query.arguments)
        this.args.forEach((key) => {
            const argValue = args[key]
            if (!keys.includes(key)) {
                throw new Error(
                    `GraphQL argument ${key} does not exist in query ${this.query.name}`,
                )
            }

            this.TYPE_VALIDATION.forEach((validation) => {
                if (this.query.arguments[key].type === 'self') {
                    throw new Error(
                        `Operation query argument type should not be self.`,
                    )
                }

                if (
                    validation[0].includes(
                        this.query.arguments[key].type.name,
                    ) &&
                    typeof argValue !== validation[1]
                ) {
                    throw new Error(
                        `GraphQL argument ${key} is not a ${validation[1]} value in query ${this.query.name}`,
                    )
                }
            })
        })
    }
}
