import { PropsWithChildren } from 'react'

export const generateMetadata = async () => {
    const url = `${process.env.BASE_URL}/dev-tools/text-sort`
    return {
        title: `Sujin | Dev Tool | Text Sort`,
        description: 'Sort Text',
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | Dev Tool | Text Sort`,
            referer: url,
        },
        metadataBase: new URL(url),
    }
}

export default function TextSort({ children }: PropsWithChildren) {
    return children
}
