'use client'
import { ApolloProvider } from '@apollo/client/react'
import { Provider as ReduxProvider } from 'react-redux'
import type { PropsWithChildren } from 'react'
/* Modules */
import { client } from '@lib/apollo/apollo-client-frontend'
import { store } from '@lib/store'

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <ReduxProvider store={store}>
                <ApolloProvider client={client}>{children}</ApolloProvider>
            </ReduxProvider>
        </>
    )
}
