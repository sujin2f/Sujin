'server-only'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'

const uri = process.env.GQL_ENDPOINT
export const client = new ApolloClient({
    link: new HttpLink({ uri, fetch }),
    cache: new InMemoryCache({
        typePolicies: {
            Post: {
                fields: {
                    images: {
                        merge(existing, incoming, { mergeObjects }) {
                            return mergeObjects(existing, incoming)
                        },
                    },
                },
            },
        },
    }),
    queryDeduplication: false,
})
