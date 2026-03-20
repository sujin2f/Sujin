/* Utils */
import { getBookmarks } from './getBookmarks'
import { getFocusCloudItems } from './getFocusCloudItems'
import { createBookmark } from './createBookmark'
import { removeBookmark } from './removeBookmark'
import { createFocusCloudItem } from './createFocusCloudItem'
import { removeFocusCloudItem } from './removeFocusCloudItem'
/* T_Types */
import type { T_Context } from '@src/types'
import type { T_Focus_Message } from '@common/types'

/**
 * Focus resolvers that belongs to Focus Browser.
 */
export const focus = {
    Query: {
        focusBookmarks: async (_: unknown, __: unknown, context: T_Context) => await getBookmarks(context.token),
        focusCloudItems: async (_: unknown, __: unknown, context: T_Context) => await getFocusCloudItems(context.token),
    },
    Mutation: {
        createFocusBookmark: async (_: unknown, message: { message: T_Focus_Message }, context: T_Context) =>
            await createBookmark(message.message, context.token),
        removeFocusBookmark: async (_: unknown, { id }: { id: string }, context: T_Context) =>
            await removeBookmark(id, context.token),
        createFocusCloudItem: async (_: unknown, message: { message: T_Focus_Message }, context: T_Context) =>
            await createFocusCloudItem(message.message, context.token),
        removeFocusCloudItem: async (_: unknown, { id }: { id: string }, context: T_Context) =>
            await removeFocusCloudItem(id, context.token),
    },
}
