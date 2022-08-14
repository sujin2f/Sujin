import { ApolloClient, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache({
    typePolicies: {
        Term: {
            keyFields: ['slug', 'page', 'type'],
        },
    },
})

export const graphqlClient = new ApolloClient({
    uri: '/graphql',
    cache,
})
