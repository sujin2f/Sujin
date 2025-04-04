import type { Metadata } from 'next'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import Articles from '@app/(archive)/NotFoundArticles'
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'
/* Helpers */
import { getPathName } from '@app/_lib/utils/server'
import { getMenuNameFromPath } from '@app/_lib/utils/system'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

export default async function NotFound() {
    const path = await getPathName()
    const menu = getMenuNameFromPath(path)
    return (
        <>
            <Header />
            <main>
                <Banner
                    menu={menu}
                    banner={{
                        title: '404 Not Found',
                        excerpt:
                            'We cannot find the result. See below for recent articles.',
                    }}
                />
                <Articles />
            </main>
            <Footer />
        </>
    )
}
