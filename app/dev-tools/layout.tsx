import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Utils */
import { getMetaData } from '@app/_lib/utils-server'
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
    return children
}
