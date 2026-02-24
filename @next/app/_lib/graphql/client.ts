'server-only'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'

const uri = process.env.GQL_BASE_URL
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
