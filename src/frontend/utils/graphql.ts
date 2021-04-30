import { ApolloClient, InMemoryCache } from '@apollo/client'

export const graphqlClient = new ApolloClient({
    uri: `${window.globalVariable.frontend}/api`,
    cache: new InMemoryCache(),
})
