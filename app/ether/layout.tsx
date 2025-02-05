import type { Metadata } from 'next/types'
import type { PropsWithChildren } from 'react'
/* Helpers */
import { getMetaData } from '@src/utils/server'

export const generateMetadata = async (): Promise<Metadata> => {
    const metadata = await getMetaData()
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
    return children
}
