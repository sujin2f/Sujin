import { headers } from 'next/headers'

import type { Metadata } from 'next/types'
import { PropsWithChildren } from 'react'
import { metadata } from '@src/constants/metadata'

export const generateMetadata = async (): Promise<Metadata> => {
    const path = (await headers()).get('x-pathname')
    if (!path || !metadata[path]) {
        return {}
    }
    const data = metadata[path]
    const metadataBase = data.openGraph?.url
        ? new URL(data.openGraph?.url)
        : undefined

    return {
        ...data,
        title: `Sujin | Ether | ${data.title}`,
        openGraph: {
            title: `Sujin | Ether | ${data}`,
        },
        metadataBase,
    }
}

export default async function Layout({ children }: PropsWithChildren) {
    return children
}
