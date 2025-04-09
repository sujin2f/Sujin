import type { Metadata } from 'next'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { NotFoundClient } from '@app/not-found-client'
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

export default async function Wrapper() {
    return (
        <>
            <Header />
            <main>
                <Banner
                    banner={{
                        title: '404 Not Found',
                        excerpt:
                            'We cannot find the result. See below for recent articles.',
                    }}
                />
                <NotFoundClient />
            </main>
            <Footer />
        </>
    )
}
