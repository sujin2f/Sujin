import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Utils */
import { getMetaData } from '@lib/utils/server/header'

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
    return <main className="container mx-auto max-w-4xl my-15">{children}</main>
}
