import { login } from '@src/resolvers/users/login'
import { isAdmin } from '@src/resolvers/users/isAdmin'

import type { T_Context } from '@src/types'

export const users = {
    Mutation: {
        login: async (_: unknown, __: unknown, context: T_Context) =>
            await login(context.token),
        isAdmin: (_: unknown, __: unknown, context: T_Context) =>
            isAdmin(context.token),
    },
}
