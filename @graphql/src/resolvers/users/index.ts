import { login } from '@src/resolvers/users/login'
import { T_GQL_Params_Login } from '@sujin/lib/types'

export const users = {
    Mutation: {
        login: async (_: unknown, { email }: T_GQL_Params_Login) =>
            await login(email),
    },
}
