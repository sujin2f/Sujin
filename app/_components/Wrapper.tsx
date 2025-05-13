import type { PropsWithChildren } from 'react'

import FixedHeader from '@app/_components/header/FixedHeader'
import { Footer } from '@app/_components/footer'
import { Banner, BannerProps } from '@app/_components/header/Banner'
import Row from '@common/components/layout/Row'
import Column, { type ColumnProps } from '@common/components/layout/Column'
import { MENU_NAMES } from '@app/_lib/types'
import ScrollToTop from '@common/components/ScrollToTop'
import { joinClassNames } from '@common/utils/string'

type Props = ColumnProps &
    BannerProps & {
        readonly footer?: boolean
        readonly banner?: boolean
        readonly style?: Record<string, string>
        readonly className?: string
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
    style,
    className,
    ...props
}: PropsWithChildren<Props>) {
    const menu = props.menu || MENU_NAMES.MAIN

    return (
        <div
            className={joinClassNames(
                'wrapper',
                className,
                style?.wrapper,
                !banner && 'wrapper--no-banner',
            )}
        >
            <ScrollToTop />
            <FixedHeader menu={menu} style={style} />

            <main className={joinClassNames('main', style?.main)}>
                {banner && <Banner menu={menu} {...props} style={style} />}

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
