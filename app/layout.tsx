import React, { PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import { Ubuntu } from 'next/font/google'

import '@src/scss/wrapper.scss'
import '@common/scss/normalize.css'
import '@common/scss/base.scss'
import { WrapperClient } from '@app/wrapper-client'

export const metadata: Metadata = {
    title: 'Sujin',
    description: 'React, Node, Wordpress Developer',
    keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
    creator: 'Sujin Choi',
    metadataBase: new URL(process.env.BASE_URL || ''),
    openGraph: {
        images: '/thumbnail.png',
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
        icon: '/favicon-16x16.png',
        shortcut: '/favicon-32x32.png',
        apple: '/favicon-32x32.png',
    },
}

const ubuntu = Ubuntu({
    weight: ['300', '500'],
    subsets: ['latin'],
})

export default function Layout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <script>
                    {`window.dataLayer = window.dataLayer || []
                    function gtag() {
                        dataLayer.push(arguments)
                    }
                    gtag('js', new Date())
                    gtag('config', 'UA-37266518-1')`}
                </script>
            </head>
            <body className={`wrapper ${ubuntu.className}`}>
                <WrapperClient>{children}</WrapperClient>
            </body>
        </html>
    )
}
