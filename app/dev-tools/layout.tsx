import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import Wrapper from '@app/_components/Wrapper'
/* Utils */
import { getMetaData } from '@app/_lib/utils/server'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'
/* Assets */
import '@app/dev-tools/layout.scss'

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
