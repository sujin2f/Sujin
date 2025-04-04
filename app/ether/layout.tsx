import type { Metadata } from 'next/types'
import type { PropsWithChildren } from 'react'
/* Components */
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'
/* Constants */
import { MenuNames } from '@app/_lib/data/mysql/constants'
/* Utils */
import { getMetaData } from '@app/_lib/utils/server'

export const generateMetadata = async (): Promise<Metadata> => {
    let metadata: Metadata

    try {
        metadata = await getMetaData()
    } catch {
        return {}
    }

    const metadataBase = metadata.openGraph?.url
        ? new URL(metadata.openGraph?.url)
        : undefined

    return {
        ...metadata,
        title: `Sujin | Ether | ${metadata.title}`,
        openGraph: {
            title: `Sujin | Ether | ${metadata}`,
        },
        metadataBase,
    }
}

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MenuNames.ETHER_KOR} />
            {children}
            <Footer />
        </>
    )
}
