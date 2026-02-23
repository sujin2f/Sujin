'use server'
import { type PropsWithChildren, type ReactNode } from 'react'
import { Ubuntu } from 'next/font/google'
import Script from 'next/script'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import type { Metadata } from 'next'
/* CONSTANTS */
import { DEFAULT_THUMBNAIL } from '@lib/constants'
/* Components */
import { ReduxProvider } from '@app/_components/ReduxProvider'
import Error from '@app/global-error'
import { UserInfoProvider } from '@app/_components/UserInfoProvider'
import { Wrapper } from '@app/_components/layout/Wrapper'
import DefaultTopBar from '@app/@topbar/default'
import DefaultFooter from '@app/@footer/default'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'
/* Assets */
import '@app/_lib/scss/style.scss'

export const generateMetadata = async (): Promise<Metadata> => {
    const metadata: Metadata = {
        title: 'Sujin',
        description: 'React, Node, Wordpress Developer',
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        creator: 'Sujin Choi',
        referrer: 'origin',
        openGraph: {
            images: DEFAULT_THUMBNAIL,
            url: process.env.NEXT_BASE_URL,
            title: 'Sujin',
            siteName: 'Sujin',
        },
        robots: {
            index: true,
            follow: true,
            nocache: true,
        },
        icons: {
            icon: `${process.env.NEXT_BASE_URL}/assets/favicon-16x16.png`,
            shortcut: `${process.env.NEXT_BASE_URL}/assets/favicon-32x32.png`,
            apple: `${process.env.NEXT_BASE_URL}/assets/favicon-32x32.png`,
        },
    }

    if (process.env.NEXT_BASE_URL) {
        metadata.metadataBase = new URL(process.env.NEXT_BASE_URL)
    }

    return metadata
}

const ubuntu = Ubuntu({
    weight: ['300', '500'],
    subsets: ['latin'],
})

type Props = PropsWithChildren & {
    banner: ReactNode
    topbar: ReactNode
    footer: ReactNode
}

/**
 * Layout component that wraps the application with common layout elements.
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function AppLayout({ children, banner, topbar, footer }: Props) {
    const user = await getUserInfo().catch(() => null)
    const adSense = process.env.GOOGLE_AD_CLIENT ? (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.GOOGLE_AD_CLIENT}`}
            crossOrigin="anonymous"
        ></Script>
    ) : (
        <></>
    )

    return (
        <html lang="en">
            <head>{adSense}</head>
            <body className={`${ubuntu.className} font-light leading-8`}>
                <ReduxProvider>
                    <UserInfoProvider user={user}>
                        <Wrapper>
                            <ErrorBoundary errorComponent={Error}>
                                {/* For not-found and error */}
                                {topbar || <DefaultTopBar />}
                                {banner}
                                {children}
                                {footer || <DefaultFooter />}
                            </ErrorBoundary>
                        </Wrapper>
                    </UserInfoProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}
