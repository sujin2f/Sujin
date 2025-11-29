import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import Wrapper from '@lib/components/Wrapper'
/* Utils */
import { getMetaData } from '@lib/utils/server/header'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Assets */
import './layout.scss'

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
    return <Wrapper menu={MENU_NAMES.DEV_TOOL}>{children}</Wrapper>
}
