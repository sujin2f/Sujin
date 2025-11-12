import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'
import { IS_DEV } from '@sujin/share/constants/helper'

const uri = IS_DEV ? 'http://localhost:4000' : 'http://localhost:4000'

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
