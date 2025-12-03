import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import { Wrapper } from '@lib/components/Wrapper'
import { Footer } from '@lib/components/footer'
import FixedHeader from '@lib/components/header/FixedHeader'
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
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
    return (
        <Wrapper>
            <FixedHeader menu={MENU_NAMES.DEV_TOOL} />
            <Banner menu={MENU_NAMES.DEV_TOOL} />
            <Row>
                <Column small={12}>{children}</Column>
            </Row>
            <Footer />
        </Wrapper>
    )
}
