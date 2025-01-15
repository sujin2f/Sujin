import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { PropsWithChildren } from 'react'

export const generateMetadata = async () => {
    const url = `${process.env.BASE_URL}/ether`
    return {
        title: `Ether`,
        description: 'Hypothesis on the Spatial and Temporal Aspects of Matter',
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Ether`,
            referer: url,
        },
        metadataBase: new URL(url),
    }
}

export default function EtherRootLayout({ children }: PropsWithChildren) {
    return (
        <article>
            <Row>
                <Column small={12} large={8} largeOffset={2}>
                    {children}
                </Column>
            </Row>
        </article>
    )
}
