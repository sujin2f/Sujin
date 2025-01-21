import type {
    IQueryArgs,
    // GQLField,
    IQuery,
    ScalarJSType,
    QueryReturnType,
} from '.'
import { isEmpty } from '../utils/object'
import { fieldToString } from './util'

/**
 * GQL Query
 *
 * @template A argument type
 * @template R return type
 * @implements {IQuery}
 */
export class GQLQuery<A extends ScalarJSType[], R> implements IQuery<A, R> {
    readonly name: string
    readonly rtn: QueryReturnType<R>
    readonly args: IQueryArgs
    public _callback?: (...args: A) => Promise<R>

    constructor(name: string, args: IQueryArgs, rtn: QueryReturnType<R>) {
        this.name = name
        this.args = args
        this.rtn = rtn
    }

    toString() {
        const args = !isEmpty(this.args)
            ? `(${Object.entries(this.args)
                  .map(
                      ([id, arg]) =>
                          `${id}: ${arg.type.name}${arg.required ? '!' : ''}`,
                  )
                  .join(', ')})`
            : ''
        const rtn = fieldToString(this.rtn)
        return `${this.name}${args}: ${rtn}`
    }

    toOperation(fields: string, ...args: A) {
        const argStr = Object.keys(this.args)
            .map((key, index) => {
                return `${key}: ${typeof args[index] === 'string' ? `"${args[index]}"` : args[index]}`
            })
            .join(', ')

        return JSON.stringify({
            query: `{\n${this.name}${argStr ? `(${argStr})` : ''} {\n${fields}\n}\n}`,
        })
    }

    setCallback(callback: (...args: A) => Promise<R>) {
        this._callback = callback
        return this
    }

    get callback() {
        if (!this._callback) {
            throw Error('Callback does not assigned.')
        }
        return (_: unknown, args: Record<string, ScalarJSType>) => {
            if (args) {
                return this._callback!(...(Object.values(args) as A))
            }

            this._callback!(...(Object.values({}) as A))
        }
    }
}
