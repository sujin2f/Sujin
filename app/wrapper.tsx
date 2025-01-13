'use client'

import React, { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import { useContext } from '@src/store'
import { Banner } from '@src/components/layout/header/Banner'
import { FixedHeader } from '@src/components/layout/header/FixedHeader'
import { Footer } from '@src/components/layout/footer'

import '@src/scss/front-page.scss'

const queryClient = new QueryClient()

export default function Wrapper({ children }: PropsWithChildren) {
    const pathname = usePathname()
    const [{ wrapperClass }] = useContext()

    return (
        <QueryClientProvider client={queryClient}>
            <div className={`wrapper ${wrapperClass}`}>
                <FixedHeader />
                <main>
                    <Banner />
                    {children}
                </main>
                {pathname !== '/' && <Footer />}
            </div>
        </QueryClientProvider>
    )
}
