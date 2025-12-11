import type { PropsWithChildren } from 'react'

export const metadata = {
    title: 'Text Sort',
    description: 'Text sorting tool',
    keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
    openGraph: {
        url: `/dev-tools/text-sort`,
    },
}

export default function CaseTool({ children }: PropsWithChildren) {
    return children
}
