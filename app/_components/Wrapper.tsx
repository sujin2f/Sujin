import type { PropsWithChildren } from 'react'
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'
import { Banner } from '@app/_components/header/Banner'
import { Row } from '@common/components/layout/Row'
import { Column, ColumnProps } from '@common/components/layout/Column'
import { BannerProps } from '@app/_lib/types'
import ScrollToTop from '@common/components/ScrollToTop'

type Props = ColumnProps &
    PropsWithChildren<BannerProps> & {
        readonly className?: string
    }

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default function Wrapper({
    larger,
    large,
    medium,
    small,
    largerOffset,
    largeOffset,
    mediumOffset,
    smallOffset,
    children,
    menu,
    title,
    excerpt,
    icon,
    prefix,
    background,
    backgroundColor,
    className,
}: Props) {
    return (
        <>
            <ScrollToTop />
            <Header menu={menu} />
            <main className={className}>
                <Banner
                    menu={menu}
                    title={title}
                    excerpt={excerpt}
                    icon={icon}
                    prefix={prefix}
                    background={background}
                    backgroundColor={backgroundColor}
                />

                <Row>
                    <Column
                        larger={larger}
                        large={large}
                        medium={medium}
                        small={small || 12}
                        largerOffset={largerOffset}
                        largeOffset={largeOffset}
                        mediumOffset={mediumOffset}
                        smallOffset={smallOffset}
                    >
                        {children}
                    </Column>
                </Row>
            </main>
            <Footer />
        </>
    )
}
