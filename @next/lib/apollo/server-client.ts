import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'
import { IS_DEV } from '@sujin/share/constants/helper'

const uri = process.env.NEXT_PUBLIC_APOLLO_SERVER
console.log(uri)

export const client = new ApolloClient({
    link: new HttpLink({ uri, fetch }),
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
})
