import type { Metadata } from 'next/types'
import type { PropsWithChildren } from 'react'
/* Utils */
import { getMetaData } from '@app/_lib/utils/server'

export const generateMetadata = async (): Promise<Metadata> => {
    let metadata: Metadata

    try {
        metadata = await getMetaData()
    } catch {
        return {}
    }

    return {
        ...metadata,
        title: `Sujin | Ether | ${metadata.title}`,
        openGraph: {
            title: `Sujin | Ether | ${metadata}`,
        },
    }
}

export default async function Layout({ children }: PropsWithChildren) {
    return children
}
