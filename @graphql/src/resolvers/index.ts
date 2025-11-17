import { users } from '@src/resolvers/users'
import { recipes } from '@src/resolvers/recipes'
import { misc } from '@src/resolvers/misc'
import { wordpress } from '@src/resolvers/wordpress'

export const Query = {
    ...recipes.Query,
    ...misc.Query,
    ...wordpress.Query,
}

export const Mutation = {
    ...users.Mutation,
    ...recipes.Mutation,
    ...misc.Mutation,
    ...wordpress.Mutation,
}
