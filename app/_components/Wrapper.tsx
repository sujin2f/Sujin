import type { PropsWithChildren } from 'react'

import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'
import { Banner } from '@app/_components/header/Banner'
import { Row } from '@common/components/layout/Row'
import { Column, ColumnProps } from '@common/components/layout/Column'
import { BannerProps } from '@app/_lib/types'
import ScrollToTop from '@common/components/ScrollToTop'
import { joinClassNames } from '@common/utils/string'

type Props = ColumnProps &
    PropsWithChildren<BannerProps> & {
        readonly className?: string
    }

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default function Wrapper({
    small,
    children,
    className: classNameProp,
    ...props
}: Props) {
    const className = joinClassNames('wrapper', classNameProp)
    return (
        <>
            <ScrollToTop />
            <Header menu={props.menu} />
            <main className={className}>
                <Banner {...props} />

                <Row>
                    <Column small={small || 12} {...props}>
                        {children}
                    </Column>
                </Row>
            </main>
            <Footer />
        </>
    )
}
