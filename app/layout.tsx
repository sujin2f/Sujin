import React from 'react'
import { Ubuntu } from 'next/font/google'
import Script from 'next/script'
import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import { Footer } from '@components/footer'
import Header from '@components/header'

/* Assets */
import '@src/scss/wrapper.scss'
import '@common/scss/normalize.css'
import '@common/scss/base.scss'

export const metadata: Metadata = {
    title: 'Sujin',
    description: 'React, Node, Wordpress Developer',
    keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
    creator: 'Sujin Choi',
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || ''),
    referrer: 'origin',
    openGraph: {
        images: `${process.env.NEXT_PUBLIC_BASE_URL}/assets/thumbnail.png`,
        url: process.env.NEXT_PUBLIC_BASE_URL,
        title: 'Sujin',
        siteName: 'Sujin',
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
    },
    icons: {
        icon: `${process.env.NEXT_PUBLIC_BASE_URL}/assets/favicon-16x16.png`,
        shortcut: `${process.env.NEXT_PUBLIC_BASE_URL}/assets/favicon-32x32.png`,
        apple: `${process.env.NEXT_PUBLIC_BASE_URL}/assets/favicon-32x32.png`,
    },
}

const ubuntu = Ubuntu({
    weight: ['300', '500'],
    subsets: ['latin'],
})

/**
 * Layout component that wraps the application with common layout elements.
 *
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function Layout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}`}
                    crossOrigin="anonymous"
                ></Script>
            </head>
            <body className={`wrapper ${ubuntu.className}`}>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    )
}
