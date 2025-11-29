import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'

const uri = process.env.NEXT_PUBLIC_GQL_ENDPOINT
export const client = new ApolloClient({
    link: new HttpLink({ uri, fetch }),
    cache: new InMemoryCache(),
})
