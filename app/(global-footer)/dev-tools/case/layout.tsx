import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import type { Metadata } from 'next/types'
import { PropsWithChildren } from 'react'

const url = `${process.env.BASE_URL}/dev-tools/case`
export const metadata: Metadata = {
    title: `Sujin | Dev Tool | Case Tool`,
    description: 'Convert a string into many cases.',
    // TODO
    keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
    openGraph: {
        title: `Sujin | Dev Tool | Case Tool`,
        url: url,
    },
    metadataBase: new URL(url),
}

export default function CaseTool({ children }: PropsWithChildren) {
    return (
        <>
            <Banner
                menu={MenuNames.DEV_TOOL}
                banner={{
                    title: 'Case Tool',
                    excerpt: 'Convert a string into many cases.',
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
