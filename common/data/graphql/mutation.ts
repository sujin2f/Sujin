import type { ScalarJSType } from '.'
import { OperationType } from './constants'
import { GQLQuery } from './query'

/**
 * GQL Query
 *
 * @template A argument type
 * @template R return type
 * @implements {IQuery}
 */
export class GQLMutation<A extends ScalarJSType[], R> extends GQLQuery<A, R> {
    public type = OperationType.MUTATION
}
