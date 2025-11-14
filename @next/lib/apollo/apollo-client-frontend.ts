import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const uri = process.env.NEXT_PUBLIC_APOLLO_SERVER

export const client = new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
})
