import { login } from '@src/resolvers/users/login'

export const users = {
    Mutation: {
        login: async (_: unknown, { email }: { email: string }) =>
            await login(email),
    },
}
