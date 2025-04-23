import type { PropsWithChildren } from 'react'

import FixedHeader from '@app/_components/header/FixedHeader'
import { Footer } from '@app/_components/footer'
import { Banner } from '@app/_components/header/Banner'
import Row from '@common/components/layout/Row'
import Column, { type ColumnProps } from '@common/components/layout/Column'
import { BannerProps, MENU_NAMES } from '@app/_lib/types'
import ScrollToTop from '@common/components/ScrollToTop'
import { joinClassNames } from '@common/utils/string'

type Props = ColumnProps &
    BannerProps & {
        readonly className?: string
        readonly footer?: boolean
        readonly banner?: boolean
    }

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default function Wrapper({
    small,
    children,
    footer = true,
    banner = true,
    ...props
}: PropsWithChildren<Props>) {
    const className = joinClassNames(
        'wrapper',
        !banner && 'wrapper--no-banner',
        props.className,
    )
    const menu = props.menu || MENU_NAMES.MAIN
    return (
        <div className={className}>
            <ScrollToTop />
            <FixedHeader menu={menu} />
            <main>
                {banner && <Banner menu={menu} {...props} />}

                <Row>
                    <Column small={small || 12} {...props}>
                        {children}
                    </Column>
                </Row>
            </main>
            {footer && <Footer />}
        </div>
    )
}
