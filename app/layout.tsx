import React, { PropsWithChildren, Suspense } from 'react'
import { Ubuntu } from 'next/font/google'
import Script from 'next/script'
import type { Metadata } from 'next'
/* CONSTANTS */
import { BASE_URL, DEFAULT_THUMBNAIL } from '@app/_lib/constants'
/* Assets */
import '@app/scss/wrapper.scss'
import '@common/scss/normalize.css'
import '@common/scss/base.scss'
import Loading from './loading'

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
            <body className={`wrapper ${ubuntu.className}`}>
                <Suspense fallback={<Loading />}>{children}</Suspense>
            </body>
        </html>
    )
}
