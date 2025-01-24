import React, { PropsWithChildren } from 'react'
import { Ubuntu } from 'next/font/google'
import type { Metadata } from 'next'
import Script from 'next/script'

/* Assets */
import '@src/scss/wrapper.scss'
import '@common/scss/normalize.css'
import '@common/scss/base.scss'

export const metadata: Metadata = {
    title: 'Sujin',
    description: 'React, Node, Wordpress Developer',
    keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
    creator: 'Sujin Choi',
    metadataBase: new URL(process.env.BASE_URL || ''),
    referrer: 'origin',
    openGraph: {
        images: `${process.env.BASE_URL}/thumbnail.png`,
        url: process.env.BASE_URL,
        title: 'Sujin',
        siteName: 'Sujin',
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
    },
    icons: {
        icon: `${process.env.BASE_URL}/favicon-16x16.png`,
        shortcut: `${process.env.BASE_URL}/favicon-32x32.png`,
        apple: `${process.env.BASE_URL}/favicon-32x32.png`,
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
export default function Layout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}`}
                    crossOrigin="anonymous"
                ></Script>
            </head>
            <body className={`wrapper ${ubuntu.className}`}>{children}</body>
        </html>
    )
}
