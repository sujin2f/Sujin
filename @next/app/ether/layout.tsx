import type { Metadata } from 'next/types'
import type { PropsWithChildren } from 'react'
/* Components */
import { Wrapper } from '@lib/components/Wrapper'
import { Footer } from '@lib/components/footer'
import FixedHeader from '@lib/components/header/FixedHeader'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getMetaData } from '@lib/utils/server/header'
/* Assets */
import './layout.scss'

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
    return (
        <Wrapper>
            <FixedHeader menu={MENU_NAMES.ETHER} />
            {children}
            <Footer />
        </Wrapper>
    )
}
