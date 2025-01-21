import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import type { Metadata } from 'next/types'
import { PropsWithChildren } from 'react'

const title = '가설의 검증(1): 고전 물리학'
const description = '다전자 원자에서의 뤼드베리 방정식의 적용 '
const url = `${process.env.BASE_URL}/ether/kor/document/rydberg-formula`

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
