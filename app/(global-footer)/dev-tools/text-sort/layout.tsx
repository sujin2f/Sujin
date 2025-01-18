import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import type { Metadata } from 'next/types'
import { PropsWithChildren } from 'react'

const url = `${process.env.BASE_URL}/dev-tools/text-sort`
export const metadata: Metadata = {
    title: `Sujin | Dev Tool | Text Sort`,
    description: 'Sort Text',
    // TODO
    keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
    openGraph: {
        title: `Sujin | Dev Tool | Text Sort`,
        url: url,
    },
    metadataBase: new URL(url),
}

export default function TextSort({ children }: PropsWithChildren) {
    return (
        <>
            <Banner
                menu={MenuNames.DEV_TOOL}
                banner={{
                    title: 'Text Sort',
                    excerpt: '',
                    icon: undefined,
                    prefix: undefined,
                    background: undefined,
                    backgroundColor: undefined,
                }}
                className=""
            />
            {children}
        </>
    )
}
