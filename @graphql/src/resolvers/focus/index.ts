/* Utils */
import { getBookmarks } from './getBookmarks'
import { createBookmark } from './createBookmark'
import { removeBookmark } from './removeBookmark'
/* T_Types */
import type { T_Context } from '@src/types'
import type { T_Focus_Message } from '@sujin/lib/types'

/**
 * Focus resolvers that belongs to Focus Browser.
 */
export const focus = {
    Query: {
        focusBookmarks: async (_: unknown, __: unknown, context: T_Context) => await getBookmarks(context.token),
    },
    Mutation: {
        createFocusBookmark: async (_: unknown, message: { message: T_Focus_Message }, context: T_Context) =>
            await createBookmark(message.message, context.token),
        removeFocusBookmark: async (_: unknown, id: string, context: T_Context) =>
            await removeBookmark(id, context.token),
    },
}
