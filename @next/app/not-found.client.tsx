'use client'
/* Components */
import { NotFoundList } from '@app/not-found.client.list'
/* CONSTANTS */
import { ApolloProvider } from '@apollo/client/react'
import { client } from '@lib/apollo/client'

export function NotFoundClient() {
    return (
        <ApolloProvider client={client}>
            <NotFoundList />
        </ApolloProvider>
    )
}
