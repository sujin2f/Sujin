import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import Banner from '@app/components/header/Banner'
import Header from '@app/components/header'
import Footer from '@app/components/footer'
/* Helpers */
import { MenuNames } from '@src/constants/mysql-query'
import { getMetaData } from '@src/utils/server'
/* Assets */
import '@src/scss/dev-tool.scss'

export const generateMetadata = async (): Promise<Metadata> => {
    const metadata = await getMetaData()
    const metadataBase = new URL(metadata.openGraph.url)

    return {
        ...metadata,
        title: `Sujin | Dev Tool | ${metadata.title}`,
        openGraph: {
            title: `Sujin | ${metadata}`,
        },
        metadataBase,
    }
}

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MenuNames.DEV_TOOL} />
            <main>
                <Banner menu={MenuNames.DEV_TOOL} />
                {children}
            </main>
            <Footer />
        </>
    )
}
