import { PropsWithChildren } from 'react'

export const generateMetadata = async () => {
    const url = `${process.env.BASE_URL}/dev-tools/case`
    return {
        title: `Sujin | Dev Tool | Case Tool`,
        description: 'Convert a string into many cases.',
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | Dev Tool | Case Tool`,
            referer: url,
        },
        metadataBase: new URL(url),
    }
}

export default function CaseTool({ children }: PropsWithChildren) {
    return children
}
