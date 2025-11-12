'use client'
import { ApolloProvider } from '@apollo/client/react'
/* CONSTANTS */
import { client } from '@lib/apollo/client'
import { FrontPageBackground } from './front-page-background'

export function FrontPage() {
    return (
        <ApolloProvider client={client}>
            <FrontPageBackground />
        </ApolloProvider>
    )
}
