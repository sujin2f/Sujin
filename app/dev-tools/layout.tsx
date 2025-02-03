import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import Banner from '@components/header/Banner'
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

export default async function DevToolLayout({ children }: PropsWithChildren) {
    return (
        <main>
            <Banner menu={MenuNames.DEV_TOOL} />
            {children}
        </main>
    )
}
