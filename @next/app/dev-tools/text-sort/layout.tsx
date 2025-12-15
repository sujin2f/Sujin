import type { PropsWithChildren } from 'react'

export const metadata = {
    title: 'Text Sort',
    description: 'Text sorting tool',
    keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
    openGraph: {
        url: `${process.env.NEXT_BASE_URL}/dev-tools/text-sort`,
    },
}

export default function TextSort({ children }: PropsWithChildren) {
    return children
}
