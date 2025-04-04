import type { Metadata } from 'next'
/* Components */
import Banner from '@app/components/header/Banner'
import ArchiveRecent from '@components/NotFoundArticles'
import Header from '@app/components/header'
import Footer from '@app/components/footer'
/* Helpers */
import { getPathName } from '@src/utils/server'
import { getMenuNameFromPath } from '@src/utils/system'

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
                <ArchiveRecent />
            </main>
            <Footer />
        </>
    )
}
