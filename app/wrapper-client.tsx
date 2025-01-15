'use client'

import React, { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Store } from '@src/store'

import '@src/scss/front-page.scss'

const queryClient = new QueryClient()

export const WrapperClient = ({ children }: PropsWithChildren) => {
    return (
        <Store>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </Store>
    )
}
