import type { PropsWithChildren } from 'react'
/* Components */
import ScrollToTop from '@app/_components/ScrollToTop'

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export function Wrapper({ children }: PropsWithChildren) {
    return (
        <>
            <ScrollToTop />
            {children}
        </>
    )
}
