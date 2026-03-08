/* Utils */
import { getDevices } from './getDevices'
import { removeDevices } from './removeDevices'
/* T_Types */
import type { T_Context } from '@src/types'

/**
 * Focus resolvers that belongs to Focus Browser.
 */
export const admin = {
    Query: {
        focusDevices: async (_: unknown, { page }: { page: number }, context: T_Context) =>
            await getDevices(page, context.token, context.res),
    },
    Mutation: {
        focusRemoveDevices: async (_: unknown, __: unknown, context: T_Context) => await removeDevices(context.token),
    },
}
