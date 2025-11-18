'use server'
import React, { type PropsWithChildren, Suspense } from 'react'
import { Ubuntu } from 'next/font/google'
import Script from 'next/script'
import type { Metadata } from 'next'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
/* CONSTANTS */
import { BASE_URL, DEFAULT_THUMBNAIL } from '@lib/constants'
/* Components */
import { ApolloProvider } from '@lib/components/ApolloProvider'
import { ReduxProvider } from '@lib/components/ReduxProvider'
import Error from '@app/global-error'
import { SessionProvider } from '@common/components/SessionProvider'
import Loading from '@app/loading'
/* Utils */
import { getSession } from '@lib/utils/session'
/* Assets */
import '@app/layout.scss'
import '@common/scss/base.scss'

export const generateMetadata = async (): Promise<Metadata> => {
    const metadata: Metadata = {
        title: 'Sujin',
        description: 'React, Node, Wordpress Developer',
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        creator: 'Sujin Choi',
        referrer: 'origin',
        openGraph: {
            images: DEFAULT_THUMBNAIL,
            url: BASE_URL,
            title: 'Sujin',
            siteName: 'Sujin',
        },
        robots: {
            index: true,
            follow: true,
            nocache: true,
        },
        icons: {
            icon: `${BASE_URL}/assets/favicon-16x16.png`,
            shortcut: `${BASE_URL}/assets/favicon-32x32.png`,
            apple: `${BASE_URL}/assets/favicon-32x32.png`,
        },
    }

    if (BASE_URL) {
        metadata.metadataBase = new URL(BASE_URL)
    }

    return metadata
}

const ubuntu = Ubuntu({
    weight: ['300', '500'],
    subsets: ['latin'],
})

/**
 * Layout component that wraps the application with common layout elements.
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function AppLayout({ children }: PropsWithChildren) {
    const session = await getSession()
    const adSense = process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT ? (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}`}
            crossOrigin="anonymous"
        ></Script>
    ) : (
        <></>
    )
    return (
        <html lang="en">
            <head>{adSense}</head>
            <body className={ubuntu.className}>
                <Suspense fallback={<Loading />}>
                    <SessionProvider session={session}>
                        <ApolloProvider>
                            <ReduxProvider>
                                <ErrorBoundary errorComponent={Error}>
                                    {children}
                                </ErrorBoundary>
                            </ReduxProvider>
                        </ApolloProvider>
                    </SessionProvider>
                </Suspense>
            </body>
        </html>
    )
}
