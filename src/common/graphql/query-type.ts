import type { Argument, IQuery, ReturnType } from '.'
import { Scalar } from './constants'
import { argumentsToString, returnTypeToString } from './util'
import { Error } from '../model/Error'

type Props = {
    name: string
    return: ReturnType<string>
    arguments?: Record<string, Argument<Scalar>>
}

export class GraphQLQuery implements IQuery {
    readonly name: string
    readonly return: ReturnType<string>
    readonly arguments: Record<string, Argument<Scalar>>

    public constructor(props: Props) {
        this.name = props.name
        this.return = props.return
        this.arguments = props.arguments || {}
    }

    toString() {
        const { type, list } = this.return

        if (type === 'self') {
            throw new Error(`Query return type should not be self.`)
        }

        return `${this.name}${argumentsToString(this.arguments)}: ${returnTypeToString(type.name, list)}`
    }
}

export class GraphQLQueries {
    private queries: GraphQLQuery[]
    public constructor(...queries: GraphQLQuery[]) {
        this.queries = queries
    }
    toString() {
        const queries = this.queries.map((q) => q.toString()).join('\n')
        return `type Query {\n${queries}\n}`
    }
}
