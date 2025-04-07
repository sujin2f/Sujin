import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'
/* Utils */
import { getMetaData } from '@app/_lib/utils-server'
/* Constants */
import { MENU_NAMES } from '@app/_lib/types'
/* Assets */
import './style.scss'

export const generateMetadata = async (): Promise<Metadata> => {
    const metadata = await getMetaData()

    return {
        ...metadata,
        title: `Sujin | Dev Tool | ${metadata.title}`,
        openGraph: {
            title: `Sujin | ${metadata}`,
        },
    }
}

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MENU_NAMES.DEV_TOOL} />
            <main>
                <Banner menu={MENU_NAMES.DEV_TOOL} />
                {children}
            </main>
            <Footer />
        </>
    )
}
