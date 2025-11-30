import type { PropsWithChildren } from 'react'
/* Components */
import FixedHeader from '@lib/components/header/FixedHeader'
import { Footer } from '@lib/components/footer'
import { Banner, BannerProps } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column, { type ColumnProps } from '@common/components/layout/Column'
import ScrollToTop from '@common/components/ScrollToTop'
/* Utils */
import { joinClassNames } from '@sujin/share/utils/string'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'

type Props = ColumnProps &
    BannerProps & {
        readonly footer?: boolean
        readonly banner?: boolean
        readonly style?: Record<string, string>
        readonly className?: string
    }

/**
 * Layout component
 * // TODO replace all https://github.com/sujin2f/Sujin/issues/165
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default function Wrapper({
    small,
    children,
    footer = true,
    banner = true,
    style,
    className,
    menu = MENU_NAMES.MAIN,
    ...props
}: PropsWithChildren<Props>) {
    return (
        <div className={joinClassNames('wrapper', className, style?.wrapper, !banner && 'wrapper--no-banner')}>
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
