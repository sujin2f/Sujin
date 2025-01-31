import { Banner } from '@components/header/Banner'
import NotFoundArticles from '@components/NotFoundArticles'
import { MenuNames } from '@src/constants/mysql-query'
import { Metadata } from 'next'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

export default function NotFound() {
    return (
        <main>
            <Banner
                menu={MenuNames.MAIN}
                banner={{
                    title: '404 Not Found',
                    excerpt:
                        'We cannot find the result. See below for recent articles.',
                }}
            />
            <NotFoundArticles />
        </main>
    )
}
