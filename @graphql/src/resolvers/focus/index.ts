/* Utils */
import { getBookmarks } from './getBookmarks'
/* T_Types */
import type { T_Context } from '@src/types'

/**
 * Focus resolvers that belongs to Focus Browser.
 */
export const focus = {
    Query: {
        focusBookmarks: async (_: unknown, __: unknown, context: T_Context) => await getBookmarks(context.token),
    },
}
