import { login } from '@src/resolvers/users/login'
import { isAdmin } from '@src/resolvers/users/isAdmin'

import type { T_Context } from '@src/types'
import type { T_GoogleUser } from '@sujin/lib/types'

/**
 * User-related GraphQL resolvers.
 *
 * Exposes mutations for authentication and authorization checks.
 */
export const users = {
    Mutation: {
        login: async (_: unknown, user: T_GoogleUser, context: T_Context) => await login(user, context.res),
        isAdmin: (_: unknown, __: unknown, context: T_Context) => isAdmin(context.token),
    },
}
