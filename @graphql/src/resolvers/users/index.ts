import { login } from '@src/resolvers/users/login'
import { isAdmin } from '@src/resolvers/users/isAdmin'

import type { T_Context } from '@src/types'
import { T_GQL_Params_Login } from '@sujin/lib/types/gql'

/**
 * User-related GraphQL resolvers.
 *
 * Exposes mutations for authentication and authorization checks.
 */
export const users = {
    Mutation: {
        login: async (_: unknown, { email }: T_GQL_Params_Login) => await login(email),
        isAdmin: (_: unknown, __: unknown, context: T_Context) => isAdmin(context.token),
    },
}
