import type { OperationFields, IQuery, IOperation, OperationArgs } from '.'
import { Error } from '../model/Error'

export class Operation<T extends OperationArgs> implements IOperation<T> {
    readonly query: IQuery
    readonly fields: OperationFields

    private readonly TYPE_VALIDATION = [
        [['String', 'ID'], 'string'],
        [['Int', 'Float'], 'number'],
        [['Boolean'], 'boolean'],
    ]

    constructor(query: IQuery, ...fields: OperationFields) {
        this.query = query
        this.fields = fields
    }

    toString(args: T) {
        this.validateOperation()
        let argsString = Object.keys(this.query.arguments)
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

    private validateOperation() {
        // Validation Required
        Object.entries(this.query.arguments)
            .filter(([, value]) => value.required)
            .forEach(([key]) => {
                if (!Object.keys(this.query.arguments).includes(key)) {
                    throw new Error(
                        `GraphQL argument ${key} is required in query ${this.query.name}`,
                    )
                }
            })
    }
}
