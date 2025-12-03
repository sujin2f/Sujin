import type { PropsWithChildren } from 'react'
/* Components */
import ScrollToTop from '@common/components/ScrollToTop'
/* Utils */
import { joinClassNames } from '@sujin/share/utils/string'

type Props = PropsWithChildren & {
    readonly style?: Record<string, string>
    readonly className?: string
}

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export function Wrapper({ children, style, className }: Props) {
    return (
        <div className={joinClassNames('wrapper', className, style?.wrapper)}>
            <ScrollToTop />
            {children}
        </div>
    )
}
