import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import type { Metadata } from 'next/types'
import { PropsWithChildren } from 'react'

const title = '결론'
const description = '결론과 후속 연구'
const url = `${process.env.BASE_URL}/ether/kor/document/conclusion`

export const metadata: Metadata = {
    title: `Ether | ${title}`,
    description,
    openGraph: {
        title: `Ether | ${title}`,
        url,
    },
    metadataBase: new URL(url),
}

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Banner
                menu={MenuNames.ETHER_KOR}
                banner={{
                    title,
                    excerpt: description,
                    icon: undefined,
                    prefix: undefined,
                    background: undefined,
                    backgroundColor: undefined,
                }}
                className=""
            />
            <article>
                <Row>
                    <Column small={12} large={8} largeOffset={2}>
                        {children}
                    </Column>
                </Row>
            </article>
        </>
    )
}
